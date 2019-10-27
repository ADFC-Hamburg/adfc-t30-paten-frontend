import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../user';

@Injectable({ providedIn: 'root' })
export class UserService {

  baseUrl = environment.API_BASE_URL;
  mailinglisteUrl = 'https://ml-cgn06.ispgateway.de/mailman/subscribe/soziale-t30_lists.hamburg.adfc.de';
  constructor(
    private http: HttpClient,
  ) { }

  getCurrentUser() {
    return this.http.get(this.baseUrl +
      'crud.php?entity=userdata&onlyOwn=true').pipe(map(userdata => {
        return userdata[0];
      }));
  }

  register(user: User, password: string) {
    return this.http.post<any>(this.baseUrl + 'portal.php', {
      'concern': 'register',
      'username': user.user,
      'password': password,
      'userData': {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'street_house_no': user.street_house_no,
        'city': user.city,
        'zip': user.zip,
        'phone': user.phone
      }
    });
  }
  aboniereMailinglise(email: string) {
    const params = new HttpParams({
      fromObject: {
        'email': email,
        'fullname': '',
        'pw': '',
        'pw-conf': '',
        'email-button': 'Abonnieren',
      },
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    return this.http.post<any>(this.mailinglisteUrl, params, httpOptions);
  }

  update(user: User) {
    return this.http.put(this.baseUrl + '/crud.php?entity=userdata', user);
  }

}
