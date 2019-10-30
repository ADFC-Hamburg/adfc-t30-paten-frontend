import { Component } from '@angular/core';
import { StrassenlisteService } from '../services/strassenliste.service';
import { OnInit } from '@angular/core';
import { CanDeactivateFormControlComponent } from '../can-deactivate-form-control/can-deactivate-form-control.component';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Point } from 'leaflet';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { T30SozialeEinrichtungService } from '../services/t30-soziale-einrichtung.service';
import { NominatimService } from '../services/nominatim.service';
import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { NotificationError } from '../notification-error';
import { DemandedStreetSectionService } from '../services/demanded-street-section.service';
import { forkJoin } from 'rxjs';
import { StreetSectionEditComponent } from '../street-section-edit/street-section-edit.component';
import { HAMBURG_LAT, HAMBURG_LON, KITA_TRAEGER, KITA_TRAEGER_POST } from '../const';


@Component({
  selector: 'app-soziale-einrichtung-edit',
  templateUrl: './soziale-einrichtung-edit.component.html',
  styleUrls: ['./soziale-einrichtung-edit.component.css']
})

export class SozialeEinrichtungEditComponent extends CanDeactivateFormControlComponent implements OnInit {
  id = -1;
  loading = false;
  KITA_TRAEGER = KITA_TRAEGER;
  KITA_TRAEGER_POST = KITA_TRAEGER_POST;
  public loadedData: SozialeEinrichtung = SozialeEinrichtung.DEFAULT;
  public einrichtung: FormGroup = this.fb.group({
    id: [-1],
    position: [[HAMBURG_LON, HAMBURG_LAT]],
    mapPos: [[HAMBURG_LON, HAMBURG_LAT]],
    newPos: [[HAMBURG_LON, HAMBURG_LAT]],
    name: ['', Validators.required],
    street_house_no: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['Hamburg', Validators.required],
    type: ['1', Validators.required],
    company: [0],
    streetSections: this.fb.array([
    ]),
    streetsection_complete: [false],
  });
  filteredUsers = [];
  strassenliste: string[] = [];
  public tileLayerUrl: string = OSM_TILE_LAYER_URL;
  public marker = {
    draggable: true,
    iconSize: new Point(25, 41),
    iconAnchor: new Point(12, 41),
    popupAnchor: new Point(1, -34),
    tooltipAnchor: new Point(16, -28),
    shadowSize: new Point(41, 41)
  };
  position = [HAMBURG_LON, HAMBURG_LAT];
  mapPos = [HAMBURG_LON, HAMBURG_LAT];
  newPos = [HAMBURG_LON, HAMBURG_LAT];
  step = 3;
  near = [];
  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sozService: T30SozialeEinrichtungService,
    private streetSectionService: DemandedStreetSectionService,
    private strassenlisteService: StrassenlisteService,
    private nominatimService: NominatimService,
  ) {
    super();
  }
  getSozService() {
    return this.sozService;
  }
  getFormControl() {
    return this.einrichtung;
  }
  getKitaTraegerKeys() {
    return Object.keys(this.KITA_TRAEGER).sort();
  }
  getKitaTraegerPostKeys() {
    return Object.keys(this.KITA_TRAEGER_POST);
  }
  getStrassenAbschnitte() {
    return this.einrichtung.get('streetSections') as FormArray;
  }
  addStrassenAbschnitt() {
    this.getStrassenAbschnitte().push(StreetSectionEditComponent.createAngrStrassenFbGroup(this.fb));
  }
  deleteStrassenAbschnitt(index: number): void {
    if (confirm('Soll der Straßenabschnitt wirklich gelöscht werden?')) {
      this.deleteStrassenAbschnittNoAsk(index);
    }
  }
  deleteStrassenAbschnittNoAsk(index: number): void {
    this.getStrassenAbschnitte().removeAt(index);
  }
  changePosFB(value) {
    if ((this.position[0] !== value[0]) ||
      (this.position[1] !== value[1])) {
      this.position = [value[0], value[1]];
      this.mapPos = [value[0], value[1]];
      this.newPos = [value[0], value[1]];
    }
  }
  isMarkerMoved() {
    return ((this.position[0] !== this.newPos[0]) || (this.position[1] !== this.newPos[1]));
  }
  mapMoveEnd() {
    this.einrichtung.patchValue({
      newPos: this.newPos,
    });
  }
  posReset() {
    this.newPos = this.position;
  }
  posAenderung() {
    this.einrichtung.patchValue({
      position: this.newPos,
    });
    if (this.step === 2) {
      this.searchNear();
    }
  }
  mapDblClick(event) {
    if (event.latlng) {
      this.newPos = [event.latlng.lng, event.latlng.lat];
      this.einrichtung.patchValue({
        newPos: this.newPos,
      });
    }
  }
  validateAllFormFields(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(field => {
        this.validateAllFormFields(control.get(field));
      });
    } else if (control instanceof FormArray) {
      let i = 0;
      while (i < control.length) {
        this.validateAllFormFields(control.at(i));
        i++;
      }
    } else {
      console.error('Unkown Control: ', control);
    }
  }
  public onSave() {
    this.einrichtung.get('id').setValue(this.id);
    this.validateAllFormFields(this.einrichtung);
    if (this.einrichtung.valid) {
      const val = this.einrichtung.value;
      delete val.streetSections;
      let action;
      let institutionId = val.id;
      if (val.id === -1) {
        delete val.id;
        action = this.sozService.create(new SozialeEinrichtung(val));
      } else {
        action = this.sozService.save(new SozialeEinrichtung(val));
      }
      action.subscribe(result => {
        const forkArray = [];
        const sss = this.streetSectionService;
        let showConfirmDialog = false;
        if ('id' in result) {
          institutionId = result.id;
          this.id = result.id;
        }
        if (this.getStrassenAbschnitte().value.length === 0) {
          if (this.step === 3) {
            this.setSubmitted();
            this.router.navigate(['einrichtung', 'view', institutionId]);
          } else {
            this.step = 3;
          }
        } else {
          this.getStrassenAbschnitte().value.forEach(function(streetSectionValue) {
            streetSectionValue.institution = institutionId;
            if (streetSectionValue.id === '') {
              delete streetSectionValue.id;
              forkArray.push(sss.create(streetSectionValue));
              showConfirmDialog = true;
            } else {
              forkArray.push(sss.save(streetSectionValue));
            }
          });
          forkJoin(forkArray).subscribe(results => {
            // FIXME: checkResults
            if (showConfirmDialog) {
              confirm('Danke für die Angaben zu angrenzenden Straßenabschnitten. ' +
                'Auf der folgenden Seite kannst du bei den Straßenabschnitten, ' +
                'die mit "Hier fehlt Tempo 30" gekennzeichnet wurden, jeweils ' +
                'auf "Tempo 30 fordern" klicken, um eine E-Mail an das ' +
                'Polizeikommissariat zu generieren.');
            }
            this.setSubmitted();
            this.router.navigate(['einrichtung', 'view', institutionId]);
          });
        }
      });
    } else {
      throw new NotificationError('Bitte Fehler korrigieren.');
    }
  }
  load(id) {
    this.id = id;
    this.sozService.get(id).subscribe(data => {
      data.type = data.type.toString();
      data.company = data.company.toString();
      this.einrichtung.patchValue(data);
      this.einrichtung.patchValue({
        mapPos: [data.position[0], data.position[1]],
        newPos: [data.position[0], data.position[1]]
      });
      this.loadedData = data;
    });
    this.streetSectionService.list(id).subscribe(data => {
      const newLen = data.length;
      while (this.getStrassenAbschnitte().length > newLen) {
        this.deleteStrassenAbschnittNoAsk(this.getStrassenAbschnitte().length);
      }
      while (this.getStrassenAbschnitte().length < newLen) {
        this.addStrassenAbschnitt();
      }
      let i = 0;
      while (i < data.length) {
        this.getStrassenAbschnitte().controls[i].patchValue(data[i]);
        i++;
      }
    });
  }
  searchNear() {
    this.loading = true;
    this.sozService.getNear(this.position[1], this.position[0]).subscribe(
      near => {
        this.near = near;
        if (this.near.length === 0) {
          this.step = 3;
        }
        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
        confirm('Leider konnten mögliche Dubletten gerade nicht ermittelt werden. ' +
          'Bitte versuche es später erneut. ' +
          'Informiere gerne auch den ADFC');
        this.cancel();
      }
    );
  }
  searchPos() {
    this.validateAllFormFields(this.einrichtung.get('street_house_no'));
    this.validateAllFormFields(this.einrichtung.get('zip'));
    this.validateAllFormFields(this.einrichtung.get('city'));
    const valid = this.einrichtung.get('street_house_no').valid &&
      this.einrichtung.get('city').valid &&
      this.einrichtung.get('zip').valid;
    if (!valid) {
      throw new NotificationError('Bitte Fehler korrigieren.');
    }
    this.loading = true;
    this.nominatimService.getPosition(
      this.einrichtung.get('street_house_no').value,
      this.einrichtung.get('zip').value,
      this.einrichtung.get('city').value
    ).subscribe(
      data => {
        this.einrichtung.patchValue({
          mapPos: [data[0], data[1]],
          position: [data[0], data[1]],
          newPos: [data[0], data[1]]
        });
        this.step = 2;
        this.searchNear();
      },
      error => {
        console.error(error);
        this.loading = false;
        confirm('Leider konnte die Position gerade nicht ermittelt werden. ' +
          'Bitte versuche es später erneut. ' +
          'Sollte der Fehler länger auftreten Informiere bitte den ADFC');
        this.cancel();
      }
    );
  }
  cancel() {
    this.setSubmitted();
    this.router.navigate(['main']);
  }
  ngOnInit() {
    this.einrichtung.get('position').valueChanges.subscribe(x => this.changePosFB(x));
    this.route.params.subscribe(param => {
      if (param.id !== '-1') {
        this.step = 3;
        this.load(param.id);
      } else {
        this.step = 1;
      }
    });
    this.strassenlisteService.getAll().subscribe(liste => {
      this.strassenliste = liste;
    });
    this.einrichtung.get('streetsection_complete').disable();
    this.einrichtung.get('streetSections').valueChanges.subscribe(
      streetSections => {
        const newDisable = (streetSections.length === 0);
        const oldDisable = this.einrichtung.get('streetsection_complete').disabled;
        if (oldDisable !== newDisable) {
          if (newDisable) {
            this.einrichtung.get('streetsection_complete').setValue(false);
            this.einrichtung.get('streetsection_complete').disable();
          } else {
            this.einrichtung.get('streetsection_complete').enable();
          }
        }
      });
  }
}
