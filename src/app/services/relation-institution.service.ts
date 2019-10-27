import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { NotificationError } from '../notification-error';
import { map } from 'rxjs/operators';

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
export class RelationInstitutionService {

  baseUrl = environment.API_BASE_URL;

  constructor(
    private http: HttpClient
  ) { }
  create(data) {
    if ('id' in data) {
      delete data.id;
    }
    return this.http.post<any>(this.baseUrl + 'crud.php?entity=relationtoinstitution', data, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  update(data) {
    return this.http.put<any>(this.baseUrl + 'crud.php?entity=relationtoinstitution', data, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  get(institutionId, userId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'crud.php?entity=relationtoinstitution&nores=[]&filter=[institution,\'' +
      institutionId + '\']and[person,\'' + userId + '\']', httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
}
