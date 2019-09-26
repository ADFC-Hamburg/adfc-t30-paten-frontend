import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { NotificationError } from '../notification-error';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-T30-Frontend-Version': environment.VERSION,
    'X-T30-Frontend-Production': String(environment.production),
    // 'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class T30SozialeEinrichtungService {
  baseUrl = environment.API_BASE_URL;

  constructor(
    private http: HttpClient
  ) { }
  convertEntry(entry) {
    entry.lat = entry.position[1];
    entry.lon = entry.position[0];
    return entry;
  }
  convertEntryBack(entry) {
    entry.position = [entry.lon, entry.lat];
    return entry;
  }
  get(id): Observable<SozialeEinrichtung> {
    return this.http.get<any>(this.baseUrl + 'crud.php?entity=institution&filter=[id,\'' + id + '\']', httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          res = res[0];
          return this.convertEntry(res);
        }));
  }
  list() {
    return this.http.get<any>(this.baseUrl + 'crud.php?entity=institution', httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          console.log(res);
          return res.map(this.convertEntry);
        }));
  }
  create(einr: SozialeEinrichtung) {
    console.log('create', einr);
    return this.http.post<any>(this.baseUrl + 'crud.php?entity=institution', this.convertEntryBack(einr), httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  save(einr: SozialeEinrichtung) {
    return this.http.put<any>(this.baseUrl + 'crud.php?entity=institution', this.convertEntryBack(einr), httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
}