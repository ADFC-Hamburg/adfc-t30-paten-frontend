import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { AbstractCrudService } from './abstractCrud.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class T30SozialeEinrichtungService extends AbstractCrudService<SozialeEinrichtung> {

  constructor(
    @Inject(HttpClient) protected http: HttpClient
  ) {
    super(http);
  }
  getEntityUrl() {
    return this.curdUrl + '?entity=institution';
  }
  getNear(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(environment.API_BASE_URL + 'findNear.php?lat=' + lat + '&lon=' + lon);
  }
}
