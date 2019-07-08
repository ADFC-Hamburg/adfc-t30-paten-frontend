import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { T30SozialeEinrichtungService } from '../t30-soziale-einrichtung.service';
const HAMBURG_LAT = 53.551086;
const HAMBURG_LON = 9.993682;
import { Point } from 'leaflet';

@Component({
  selector: 'app-forderung-edit',
  templateUrl: './forderung-edit.component.html',
  styleUrls: ['./forderung-edit.component.css']
})
export class ForderungEditComponent implements OnInit {

  id = -1;
  public einrichtung: any = {
    'name': '',
    'zusatz': '',
    'art': 0,
    'strasse': '',
    'plz': '',
    'ort': '',
    'id': -1,
    'tempo30': 1,
    'angrenzendeStrassen': [],
  };
    lat = HAMBURG_LAT;
    lon = HAMBURG_LON;
    mapLat = HAMBURG_LAT;
    mapLon = HAMBURG_LON;
    newLat = HAMBURG_LAT;
    newLon = HAMBURG_LON;
    ART_STR = [
      'Unklar',
      'Kindergaten',
      'Schule',
      'Alten- und Pflegeheim / Tagespflege',
      'Krankenhaus',
    ];
    STATUS = [
      'unklar',
      'hier wird Tempo 30gefordert',
      'hier ist Tempo 30',
      'hier fehlt Tempo 30',
      'die Behörde hat Tempo 30 abgelehnt',
      'Tempo 30 wurde angeordnet, die Schilder stehen aber noch nicht',
    ];
    BUSVERKEHR = [
      'Unklar',
      'Kein Busverkehr',
      'weniger als 6 mal/h',
      '6 mal/h oder mehr'
    ];
    public tileLayerUrl: string = OSM_TILE_LAYER_URL;
    public marker = {
      draggable: true,
      iconSize: new Point(25, 41),
      iconAnchor: new Point(12, 41),
      popupAnchor: new Point(1, -34),
      tooltipAnchor: new Point(16, -28),
      shadowSize: new Point(41, 41)
    };
  constructor(
    private route: ActivatedRoute,
      private sozService: T30SozialeEinrichtungService,
  ) { }
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = param.id;
      // FIXME anderen Service: StraßenabschnittService
      this.sozService.get(param.id).subscribe( data => {
        this.einrichtung = data;
        this.newLon = data.lon;
        this.newLat = data.lat;
        this.mapLon = data.lon;
        this.mapLat = data.lat;
      });
    });
  }

}
