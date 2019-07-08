import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    baseUrl = environment.API_BASE_URL;
    baseStubUrl = environment.API_STUB_BASE_URL;
    public currentUser: User;

    constructor(
      private http: HttpClient,
      private router: Router,
    ) {
        const o = localStorage.getItem('currentUser');
        let obj = null;
        if (o) {
         if (o !== '[object Object]') {
          obj  = JSON.parse(o);
          }
        }
        this.currentUser = obj;
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.baseUrl + 'portal.php', {
          'concern': 'login',
          'username': username,
          'password': password,
        }).pipe(map(user => {
                console.log('x-login', user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('access_token', user.token);
                    this.currentUser = user;
                }
                return user;
            }));
    }
    passwordReset(username: string) {
      return this.http.post<any>(this.baseStubUrl + 'pw-reset.php', { username });
    }
    getCurrentUser() {
      return this.currentUser;
    }
    authError() {
      this.currentUser = null;
      localStorage.removeItem('access_token');
    }
    getSessionId() {
      return this.currentUser.sessionId;
    }
    isLoggedIn(): boolean {
      return (this.currentUser !== null);
    }
    logout() {
        if (this.currentUser) {
          this.currentUser = null;
          return this.http.post<any>(this.baseUrl + 'portal.php', {
            'concern': 'logout',
          }).subscribe(results => {
            console.log(results);
          });
        }
        // remove user from local storage to log user out
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
    }
}
