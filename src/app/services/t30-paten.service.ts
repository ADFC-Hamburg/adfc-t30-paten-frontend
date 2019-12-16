import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {
  }
  submitPasswordChangeToken(token: string) {
    return this.http.get<any>(this.baseUrl + 'portal.php?passwordChange=' + token, httpOptions);
  }
  submitToken(email: string, token: string) {
    return this.http.get<any>(this.baseUrl + 'portal.php?user=' + email + '&verify=' + token, httpOptions);
  }
}
