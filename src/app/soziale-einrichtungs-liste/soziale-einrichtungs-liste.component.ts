import { Component, OnInit, ViewChild } from '@angular/core';

import { T30SozialeEinrichtungService } from '../t30-soziale-einrichtung.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-soziale-einrichtungs-liste',
  templateUrl: './soziale-einrichtungs-liste.component.html',
  styleUrls: ['./soziale-einrichtungs-liste.component.css']
})
export class SozialeEinrichtungsListeComponent implements OnInit {

  public sozEinrList = new MatTableDataSource();
  public displayedSozEinrColumns: string[] = [ 'status', 'Name', 'Strasse', 'PLZ', 'Bezirk', 'aktion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
        private sozEinrService: T30SozialeEinrichtungService,
  ) { }

  ngOnInit() {
    this.sozEinrService.list().subscribe(
      data => {
        this.sozEinrList =  new MatTableDataSource(data);
        this.sozEinrList.paginator = this.paginator;
        this.sozEinrList.sort = this.sort;
      }
    );
  }
applyFilter(filterValue: string) {
    this.sozEinrList.filter = filterValue.trim().toLowerCase();

    if (this.sozEinrList.paginator) {
      this.sozEinrList.paginator.firstPage();
    }
  }
}
