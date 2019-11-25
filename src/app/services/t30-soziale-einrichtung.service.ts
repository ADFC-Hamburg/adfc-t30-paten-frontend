import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { AbstractCrudService } from './abstractCrud.service';

import { environment } from '../../environments/environment';
class SozialeEinrichtungListResult {
  public data: SozialeEinrichtung[];
  public timestamp: number;
  public mystamp: number;
}
@Injectable({
  providedIn: 'root'
})
export class T30SozialeEinrichtungService extends AbstractCrudService<SozialeEinrichtung> {

  private timestamp = 0;
  private cacheData: SozialeEinrichtung[];
  //  private listCache = new ReplaySubject<SozialeEinrichtung[]>(1);
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
  listFast(): Observable<SozialeEinrichtung[]> {
    return this.listFastTimestamp()
      .pipe(map(
        res => {
          return this.cacheData;
        },
      ));
  }
  listFastTimestamp(): Observable<SozialeEinrichtungListResult> {
    return this.http.get<SozialeEinrichtungListResult>(environment.API_BASE_URL + 'institutionListTS.php?timestamp=' + this.timestamp)
      .pipe(map(
        res => {
          if (res.timestamp !== this.timestamp) {
            this.timestamp = res.timestamp;
            this.cacheData = res.data;
          }
          return res;
        }));
  }
}
