import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

import { NotificationError } from '../notification-error';
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
export class T30PatenService {
  baseUrl = environment.API_BASE_URL;
  baseStubUrl = environment.API_STUB_BASE_URL;
  constructor(private http: HttpClient) {
  }
  list() {
    return this.http.get<any>(this.baseStubUrl + 'pate-list.php', httpOptions)
      .pipe(
        map(res => {
          console.log('res', res);
          if (res.error) {
            throw new NotificationError(res.error);
          }
          return res;
        }));
  }
  submitPasswordChangeToken(token: string) {
    return this.http.get<any>(this.baseUrl + 'portal.php?passwordChange=' + token, httpOptions);
  }
  submitToken(email: String, token: String) {
    return this.http.get<any>(this.baseUrl + 'portal.php?user=' + email + '&verify=' + token, httpOptions);
  }
}
