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
        zusatz: [''],
        strasse: ['', Validators.required],
        plz: ['', Validators.required],
        ort: ['Hamburg', Validators.required],
        art: ['1', Validators.required],
        telefon: [''],
        t50: [true],
        angrenzendeStrassen: this.fb.array( [
          this.createAngrStrassenFbGroup()
        ]),
        keineWeiterenStrassen: [false],
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
            name: ['', Validators.required],
            von: [''],
            bis: [''],
            haupteingang: [0, Validators.required],
            status: ['1', Validators.required],
            anmerkung_bus: [''],
            buslinien: [''],
            busverkehr: [0, Validators.required],
            anmerkung: [''],
            spurigkeit: [0, Validators.required],
          });
      }
      constructor(
        protected fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private sozService: T30SozialeEinrichtungService,
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
          return this.einrichtung.get('angrenzendeStrassen') as FormArray;
        }
        addStrassenAbschnitt() {
          const fa = this.einrichtung.get('angrenzendeStrassen') as FormArray;
          fa.push(this.createAngrStrassenFbGroup());
        }
        deleteStrassenAbschnitt( index: number) {
          if (confirm('Soll der Straßenabschnitt wirklich gelöscht werden?')) {
            const fa = this.einrichtung.get('angrenzendeStrassen') as FormArray;
            fa.removeAt(index);
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
            this.sozService.save(new SozialeEinrichtung(this.einrichtung.value)).subscribe(results => {
              this.router.navigate(['einrichtung', 'view', this.id]);
            });
          } else {
            console.log('INVALID', this.einrichtung);
            throw new NotificationError('Bitte Fehler korrigieren.');
          }
        }
        public onSaveAndFordern() {
          console.log('saveAndFordern');
          let valid = false;
          let unsicher = false;
          this.getStrassenAbschnitte().controls.forEach( abschnitt => {
              if (abschnitt.get('status').value === '3') {
                valid = true;
              }
              if (abschnitt.get('status').value === '1') {
                unsicher = true;
              }
          });
          console.log(valid);
          if (!valid) {
            throw new NotificationError('Bitte Straßenabschnitte angeben für die Tempo 30 fehlt.');
          }
          if (unsicher) {
            throw new NotificationError('Bitte unklare Straßenabschnitte prüfen.');
          }
          this.einrichtung.get('id').setValue(this.id);
            this.validateAllFormFields(this.einrichtung);
            if (this.einrichtung.valid) {
              this.sozService.save(new SozialeEinrichtung(this.einrichtung.value)).subscribe(results => {
                this.router.navigate(['einrichtung', 't30fordern', this.id]);
              });
            } else {
              console.log('INVALID', this.einrichtung);
              throw new NotificationError('Bitte Fehler korrigieren.');
              }

        }
      load(id) {
        this.id = id;
        this.sozService.get(id).subscribe( data => {
          console.log(data);
          while (data.angrenzendeStrassen.length > (this.einrichtung.get('angrenzendeStrassen') as FormArray).length) {
            this.addStrassenAbschnitt();
          }
          let newLen = data.angrenzendeStrassen.length;
          if (newLen === 0) {
            newLen = 1;
          }
          while ((this.einrichtung.get('angrenzendeStrassen') as FormArray).length > newLen) {
            this.deleteStrassenAbschnitt((this.einrichtung.get('angrenzendeStrassen') as FormArray).length);
          }
          this.einrichtung.patchValue(data);
          this.einrichtung.patchValue({mapLon: data.lon, mapLat: data.lat, newLon: data.lon, newLat: data.lat});
          this.loadedData = data;
        });
      }
      ngOnInit() {
        this.einrichtung.get('lat').valueChanges.subscribe(x => this.changeLatFB(x));
        this.einrichtung.get('lon').valueChanges.subscribe(x => this.changeLonFB(x));
        this.route.params.subscribe(param => {
          console.log('x1', param);
          this.load(param.id);

        });
        this.strassenlisteService.getAll().subscribe(liste => {
          this.strassenliste = liste;
        });

      }



  }
