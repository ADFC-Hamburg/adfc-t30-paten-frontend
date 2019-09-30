import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
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
export class ForderungService {
  baseUrl = environment.API_BASE_URL;

  constructor(
    private http: HttpClient
  ) { }
  create(data) {
    if ('id' in data) {
      delete data.id;
    }
    return this.http.post<any>(this.baseUrl + 'crud.php?entity=email', data, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  update(data) {
    console.log('update', data);
    return this.http.put<any>(this.baseUrl + 'crud.php?entity=email', data, httpOptions)
      .pipe(
        map(res => {
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  getPK(institut_id: number) {
    return this.http.get<any>(this.baseUrl + 'get_pk_from_institution.php?id=' + institut_id, httpOptions);
  }
  getAktionsData(art: number) {
    return this.http.get<any>(this.baseUrl + 'aktion.php?type=' + art, httpOptions);
  }
  validateAktionsPassword(art: number, password: string) {
    return this.http.get<any>(this.baseUrl + 'aktion.php?type=' + art +
      '&password=' + password, httpOptions).pipe(
        map(data => {
          return data['pw_check'];
        }));
  }
  getChangeInfo(email: string, streetSectionId: number) {
    return this.http.get<any>(this.baseUrl +
      'isDemandedStreetSectionChanged.php?id=' +
      streetSectionId +
      '&email=' + encodeURIComponent(email), httpOptions);
  }
  get(streetSectionsId, userId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'crud.php?entity=email&nores=[]&filter=[demanded_street_section,\'' +
      streetSectionsId + '\']and[person,\'' + userId + '\']', httpOptions)
      .pipe(
        map(res => {
          console.log('res', res);
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  list(userId) {
    return this.http.get<any>(this.baseUrl + 'crud.php?refs=[(format,data),(depth,2)]&entity=email&nores=[]&filter=[person,\'' +
      userId + '\']', httpOptions)
      .pipe(
        map(res => {
          console.log('res', res);
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }

}
