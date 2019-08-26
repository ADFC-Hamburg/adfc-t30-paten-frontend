import { Component } from '@angular/core';
import { StrassenlisteService } from '../strassenliste.service';
import { OnInit } from '@angular/core';
import { CanDeactivateFormControlComponent } from '../can-deactivate-form-control/can-deactivate-form-control.component';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Point } from 'leaflet';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { T30SozialeEinrichtungService } from '../t30-soziale-einrichtung.service';
import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { NotificationError } from '../notification-error';
import { DemandedStreetSectionService } from '../demanded-street-section.service';
import { forkJoin } from 'rxjs';

const HAMBURG_LAT = 53.551086;
const HAMBURG_LON = 9.993682;


@Component({
  selector: 'app-soziale-einrichtung-edit',
  templateUrl: './soziale-einrichtung-edit.component.html',
  styleUrls: ['./soziale-einrichtung-edit.component.css']
})

export class SozialeEinrichtungEditComponent extends CanDeactivateFormControlComponent implements OnInit {
  id = -1;
  public loadedData: SozialeEinrichtung = SozialeEinrichtung.DEFAULT;
  public einrichtung: FormGroup = this.fb.group({
    id: [-1],
    lat: [HAMBURG_LAT, Validators.required],
    lon: [HAMBURG_LON, Validators.required],
    mapLat: [HAMBURG_LAT],
    mapLon: [HAMBURG_LON],
    newLat: [HAMBURG_LAT],
    newLon: [HAMBURG_LON],
    name: ['', Validators.required],
    address_supplement: [''],
    street_house_no: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['Hamburg', Validators.required],
    type: ['1', Validators.required],
    streetSections: this.fb.array([
      this.createAngrStrassenFbGroup()
    ]),
    streetsection_complete: [false],
  });
  filteredUsers = [];
  strassenliste = [];

  public tileLayerUrl: string = OSM_TILE_LAYER_URL;
  public isLoading = false;
  public marker = {
    draggable: true,
    iconSize: new Point(25, 41),
    iconAnchor: new Point(12, 41),
    popupAnchor: new Point(1, -34),
    tooltipAnchor: new Point(16, -28),
    shadowSize: new Point(41, 41)
  };
  lat = HAMBURG_LAT;
  lon = HAMBURG_LON;
  mapLat = HAMBURG_LAT;
  mapLon = HAMBURG_LON;
  newLat = HAMBURG_LAT;
  newLon = HAMBURG_LON;
  filteredStrassen = [
  ];
  createAngrStrassenFbGroup() {
    return this.fb.group({
      id: [''],
      street: ['', Validators.required],
      house_no_from: [''],
      house_no_to: [''],
      haupteingang: [0, Validators.required],
      time_restriction: [''],
      status: ['1', Validators.required],
      reason_slower_buses: [''],
      bus_lines: [''],
      much_bus_traffic: [0, Validators.required],
      user_note: [''],
      multilane: [0, Validators.required],
    });
  }
  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sozService: T30SozialeEinrichtungService,
    private streetSectionService: DemandedStreetSectionService,
    private strassenlisteService: StrassenlisteService,
  ) {
    super();
  }
  getSozService() {
    return this.sozService;
  }

  changeStrassenname(search) {
    this.isLoading = true;
    const newEntries = [];
    if (search.length > 3) {
      const lowerSearch = search.toLowerCase();
      //
      for (const entry of this.strassenliste) {
        const idx = entry.toLowerCase().indexOf(lowerSearch);
        if (idx !== -1) {
          newEntries.push(entry);
          if (newEntries.length > 40) {
            break;
          }
        }
      }
    }
    this.filteredStrassen = newEntries;
    this.isLoading = false;

  }
  getFormControl() {
    return this.einrichtung;
  }
  getStrassenAbschnitte() {
    return this.einrichtung.get('streetSections') as FormArray;
  }
  addStrassenAbschnitt() {
    this.getStrassenAbschnitte().push(this.createAngrStrassenFbGroup());
  }
  deleteStrassenAbschnitt(index: number) {
    if (confirm('Soll der Straßenabschnitt wirklich gelöscht werden?')) {
      this.getStrassenAbschnitte().removeAt(index);
    }
  }
  changeLatFB(value) {
    if (this.lat !== value) {
      this.lat = value;
      this.mapLat = value;
      this.newLat = value;
    }
  }
  changeLonFB(value) {
    if (this.lon !== value) {
      this.lon = value;
      this.mapLon = value;
      this.newLon = value;
    }
  }
  isMarkerMoved() {
    return ((this.lat !== this.newLat) || (this.lon !== this.newLon));
  }
  mapMoveEnd() {
    this.einrichtung.patchValue({
      newLat: this.newLat,
      newLon: this.newLon
    });
  }
  posReset() {
    this.newLat = this.lat;
    this.newLon = this.lon;
  }
  posAenderung() {
    this.einrichtung.patchValue({
      lat: this.newLat,
      lon: this.newLon
    });
  }
  mapDblClick(event) {
    if (event.latlng) {
      this.newLat = event.latlng.lat;
      this.newLon = event.latlng.lng;
      this.einrichtung.patchValue({
        newLat: this.newLat,
        newLon: this.newLon
      });
    }
  }
  validateAllFormFields(control: AbstractControl) {
    console.log('validate', control.valid, control);
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
    console.log('save');
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
        console.log('res', result);
        if ('id' in result) {
          institutionId = result.id;
        }
        if (this.getStrassenAbschnitte().value.length === 0) {
          this.router.navigate(['einrichtung', 'view', institutionId]);
        } else {
          this.getStrassenAbschnitte().value.forEach(function(streetSectionValue) {
            streetSectionValue.institution = institutionId;
            if (streetSectionValue.id === '') {
              delete streetSectionValue.id;
              forkArray.push(sss.create(streetSectionValue));
            } else {
              forkArray.push(sss.save(streetSectionValue));
            }
          });
          forkJoin(forkArray).subscribe(results => {
            // FIXME: checkResults
            this.setSubmitted();
            this.router.navigate(['einrichtung', 'view', institutionId]);
          });
        }
      });
    } else {
      console.log('INVALID', this.einrichtung);
      throw new NotificationError('Bitte Fehler korrigieren.');
    }
  }
  load(id) {
    this.id = id;
    this.sozService.get(id).subscribe(data => {
      console.log(data);
      /* FIXME      while (data.angrenzendeStrassen.length > (this.einrichtung.get('angrenzendeStrassen') as FormArray).length) {
              this.addStrassenAbschnitt();
            }
      let newLen = data.angrenzendeStrassen.length;*/
      data.type = data.type.toString();
      this.einrichtung.patchValue(data);
      this.einrichtung.patchValue({ mapLon: data.lon, mapLat: data.lat, newLon: data.lon, newLat: data.lat });
      this.loadedData = data;
    });
    this.streetSectionService.list(id).subscribe(data => {
      let newLen = data.length;
      if (newLen < 1) {
        newLen = 1;
      }
      while (this.getStrassenAbschnitte().length > newLen) {
        this.deleteStrassenAbschnitt(this.getStrassenAbschnitte().length);
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
  ngOnInit() {
    this.einrichtung.get('lat').valueChanges.subscribe(x => this.changeLatFB(x));
    this.einrichtung.get('lon').valueChanges.subscribe(x => this.changeLonFB(x));
    this.route.params.subscribe(param => {
      console.log('x1', param);
      if (param.id !== '-1') {
        this.load(param.id);
      }

    });
    this.strassenlisteService.getAll().subscribe(liste => {
      this.strassenliste = liste;
    });

  }



}
