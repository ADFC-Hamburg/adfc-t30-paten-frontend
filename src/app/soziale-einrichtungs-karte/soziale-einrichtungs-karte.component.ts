import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { Component, OnInit } from '@angular/core';
import { marker, Icon } from 'leaflet';
import { Observable, timer } from 'rxjs';

import { T30SozialeEinrichtungService } from '../services/t30-soziale-einrichtung.service';
import { FARBCODE } from '../const';
import { GeoPositionService } from '../services/geo-position.service';
import { environment } from '../../environments/environment';

const CustomIcon = Icon.extend({
  options: {
    iconSize: [25, 25],
    shadowSize: [25, 25],
    iconAnchor: [12, 12],
    shadowAnchor: [0, 0],
    popupAnchor: [-1, -11]
  }
});

function createSvgUrl(idx) {
  const farbe = FARBCODE[idx];
  const starSvg =
    '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="star rating" data-rating="1">' +
    '<polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill:' +
    farbe +
    ';"/>' +
    '</svg>';
  const myUrl = 'data:image/svg+xml;base64,' + window.btoa(starSvg);
  return myUrl;
}

function createSvgIcon(idx) {
  return new (CustomIcon as any)({ iconUrl: createSvgUrl(idx) });
}

@Component({
  selector: 'app-soziale-einrichtungs-karte',
  templateUrl: './soziale-einrichtungs-karte.component.html',
  styleUrls: ['./soziale-einrichtungs-karte.component.css']
})
export class SozialeEinrichtungsKarteComponent implements OnInit {
  geoData = {
    features: [],
    type: 'FeatureCollection',
    name: 'KeinTempo30ohne',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    }
  };
  newData = [];
  public tileLayerUrl: string = OSM_TILE_LAYER_URL;
  public popupProperties: any = {};
  public showLegende = false;
  public loadingMap = true;
  private timestamp = 0;
  private timer: Observable<number>;
  constructor(
    private sozEinrService: T30SozialeEinrichtungService,
    private geoPositionService: GeoPositionService
  ) { }

  loadNewData(): void {
    this.loadingMap = true;
    setTimeout(() => {
      console.log('Loading...');
      this.geoData = {
        features: this.newData,
        type: 'FeatureCollection',
        name: 'KeinTempo30ohne',
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
          }
        }
      };
      this.newData = [];
      console.log('done');
      this.loadingMap = false;
    }, 100);
  }
  load(): void {
    this.sozEinrService.listFastTimestamp().subscribe(data => {
      if (data.timestamp !== this.timestamp) {
        this.timestamp = data.timestamp;
        const items = [];
        for (const item of data.data) {
          items.push({
            type: 'Feature',
            properties: item,
            geometry: {
              type: 'Point',
              coordinates: item.position
            }
          });
        }
        this.newData = items;
        if (this.geoData.features.length === 0) {
          this.loadNewData();
        }
      }
    });
  }
  hasNewMapData(): boolean {
    return this.newData.length > 0;
  }
  ngOnInit(): void {
    this.timer = timer(100, environment.RELOAD_MAP_TIMER * 1000);
    this.timer.subscribe(() => this.load());
  }
  getGeoPosService(): GeoPositionService {
    return this.geoPositionService;
  }
  createSvgUrl(idx) {
    return createSvgUrl(idx);
  }
  pointToLayerFunc(feature, latlng) {
    const m = marker(latlng, {
      icon: createSvgIcon(feature.properties.status)
    });
    return m;
  }
  popupOpen(e) {
    this.popupProperties = e.target._source.feature.properties;
    this.popupProperties.svgUrl = createSvgUrl(this.popupProperties.tempo30);
  }
}
