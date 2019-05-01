import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

import { NotificationError } from './notification-error';
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

  list() {
    return this.http.get<any>(this.baseUrl + 'soz-einr-list.php', httpOptions)
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
