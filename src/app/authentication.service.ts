import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    baseUrl = environment.API_BASE_URL;
    baseStubUrl = environment.API_STUB_BASE_URL;
    public currentUser: string;

    constructor(
      private http: HttpClient,
      private router: Router,
      private jwtHelper: JwtHelperService,
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
		    const decodedToken = this.jwtHelper.decodeToken(user.token)
		    console.log(decodedToken);
                    this.currentUser = decodedToken.data.username;
                }
                return user;
            }));
    }

    passwordReset(username: string, newPassword: string) {
	return this.http.post<any>(this.baseUrl + 'portal.php', {
            'concern': 'passwordChange',
            'email': username,
            'newPassword': newPassword,
        });
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
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
          });
        }
        // remove user from local storage to log user out
    }
}
