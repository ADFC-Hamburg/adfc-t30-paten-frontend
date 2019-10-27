import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { Point } from 'leaflet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { T30SozialeEinrichtungService } from '../services/t30-soziale-einrichtung.service';
import { DemandedStreetSectionService } from '../services/demanded-street-section.service';
import { HAMBURG_LAT, HAMBURG_LON, STATUS, KITA_TRAEGER, KITA_TRAEGER_POST } from '../const';

@Component({
  selector: 'app-soziale-einrichtung-view',
  templateUrl: './soziale-einrichtung-view.component.html',
  styleUrls: ['./soziale-einrichtung-view.component.css']
})
export class SozialeEinrichtungViewComponent implements OnInit {

  id = -1;
  public einrichtung: any = {
    'name': '',
    'type': 0,
    'street_house_no': '',
    'zip': '',
    'city': '',
    'id': -1,
    'status': 1,
  };
  public streetSections: [];
  public streetSectionList = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns = [
    'abschnitt', 'status', 'spuren', 'bus',
    'history', 'button'
  ];
  position = [HAMBURG_LON, HAMBURG_LAT];
  mapPos = [HAMBURG_LON, HAMBURG_LAT];
  STATUS = STATUS;
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
    private streetSectionService: DemandedStreetSectionService,
  ) { }
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.sozService.get(param.id).subscribe(data => {
        this.einrichtung = data;
        this.mapPos = [data.position[0], data.position[1]];
        this.position = [data.position[0], data.position[1]];
      });
      this.streetSectionService.list(param.id).subscribe(data => {
        this.streetSectionList = new MatTableDataSource(data);
        this.streetSectionList.paginator = this.paginator;
        this.streetSectionList.sort = this.sort;
        this.streetSections = data;
      });
    });
  }
  getKitaTaeger(id: any): string {
    if (typeof id === 'string') {
      id = Number(id);
    }
    if (typeof id !== 'number') {
      throw new Error(`Expected string or number, got '${id}'.`);
    }
    if (id === 0) {
      return 'Unbekannt';
    }
    for (const key in KITA_TRAEGER) {
      if (id === KITA_TRAEGER[key]) {
        return key;
      }
    }
    for (const key in KITA_TRAEGER_POST) {
      if (id === KITA_TRAEGER_POST[key]) {
        return key;
      }
    }
    return 'Unbekannt';
  }
}
