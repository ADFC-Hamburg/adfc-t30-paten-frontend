import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import { NotificationError } from './notification-error';
// import { Observable } from 'rxjs';

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
export class DemandedStreetSectionService {
  baseUrl = environment.API_BASE_URL;

  constructor(
    private http: HttpClient
  ) { }

  optionValueToString(entry) {
    const OPTION_KEYS = ['much_bus_traffic', 'multilane', 'entrance', 'status'];
    OPTION_KEYS.forEach(key => {
      entry[key] = String(entry[key]);
    });
    return entry;
  }
  list(institutionId) {
    return this.http.get<any>(
      this.baseUrl + 'crud.php?entity=demandedstreetsection&nores=[]&filter=[institution,' +
      institutionId + ']', httpOptions
    )
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res.map(this.optionValueToString);
        }));
  }
  create(einr) {
    return this.http.post<any>(this.baseUrl + 'crud.php?entity=demandedstreetsection', einr, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
        }));
  }
  save(einr) {
    return this.http.put<any>(this.baseUrl + 'crud.php?entity=demandedstreetsection', einr, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
        }));
  }
}