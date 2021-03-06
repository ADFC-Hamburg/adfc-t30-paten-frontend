import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { NotifierService } from './notifier.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  baseUrl = environment.API_BASE_URL;
  public currentUser: string = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private notifierService: NotifierService,
  ) {
    const o = localStorage.getItem('access_token');
    if (o != null) {
      const decodedToken = this.jwtHelper.decodeToken(o);
      if (decodedToken != null) {
        this.currentUser = decodedToken.data.username;
      }
    }
  }
  private loginSuccess(user) {
    if (user && user.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      const decodedToken = this.jwtHelper.decodeToken(user.token);
      const validTime = Date.now() + (decodedToken.exp - decodedToken.iat) * 1000;
      localStorage.setItem('jwtValid', validTime.toString());
      localStorage.setItem('access_token', user.token);
      this.currentUser = decodedToken.data.username;
      this.notifierService.clearAllErrrors();
    }
    return user;
  }
  login(username: string, password: string) {
    return this.http.post<any>(this.baseUrl + 'portal.php', {
      'concern': 'login',
      'username': username,
      'password': password,
    }).pipe(map(user => {
      return this.loginSuccess(user);
    }));
  }

  passwordReset(username: string, newPassword: string) {
    return this.http.post<any>(this.baseUrl + 'portal.php', {
      'concern': 'passwordChange',
      'email': username,
      'newPassword': newPassword,
    });
  }
  extendLoginTime() {
    return this.http.post<any>(this.baseUrl + 'portal.php', {
      'concern': 'extendLogin',
    }).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        const oldToken = localStorage.getItem('access_token');
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (oldToken !== user.token) {
          this.loginSuccess(user);

        }
      }
      return user;
    }));
  }
  changePassword(newPassword: string) {
    return this.http.post<any>(this.baseUrl + 'portal.php', {
      'concern': 'passwordChange',
      'newPassword': newPassword,
    });
  }

  getCurrentUserId() {
    return this.currentUser;
  }

  authError() {
    this.currentUser = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('jwtValid');
  }

  isLoggedIn(): boolean {
    return (this.currentUser !== null);
  }

  calcLogInTime() {
    const jwtValid = localStorage.getItem('jwtValid');
    if (jwtValid != null) {
      const num = Number(jwtValid) - Date.now();
      if (num < 0) {
        this.authError();
      }
      return Math.floor(num / 1000);
    } // else
    return -1;
  }

  logout() {
    if (this.currentUser) {
      this.currentUser = null;
      return this.http.post<any>(this.baseUrl + 'portal.php', {
        'concern': 'logout',
      }).subscribe(results => {
        this.authError();
        this.router.navigate(['/sozEinrKarte']);
      });
    } else {
      this.authError();
    }
  }
}
