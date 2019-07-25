import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import { User } from './user';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl = environment.API_BASE_URL;
  baseStubUrl = environment.API_STUB_BASE_URL;
    constructor(
	private http: HttpClient,
	private authenticationService: AuthenticationService,
    ) { }

    getAll() {
        return this.http.get<User[]>(this.baseStubUrl + '/get_all_users.php');
    }

    getById(id: number) {
        return this.http.get(this.baseStubUrl + '/get_user.php?id=' + id);
    }

    getCurrentUser() {
	const currentUser = this.authenticationService.getCurrentUserId();
	return this.http.get(this.baseUrl +
			     'crud.php?entity=userdata&filter=[user,\''+
			     currentUser+
			     '\']').pipe(map(userdata => {
				 return userdata[0];
			     }));
    }

    register(user: User) {
	console.log(user);
	return this.http.post<any>(this.baseUrl + 'portal.php', {
            'concern': 'register',
            'username': user.email,
            'password': user.passwort1,
	    'userData': {
		'firstName': user.vorname,
		'lastName': user.nachname,
		'street': user.strasse,
		'number': '',
		'city': user.ort,
		'zip': user.plz,
		'phone': user.telefon
	    }
        });


    }

    update(user: User) {
        return this.http.put(this.baseUrl + '/crud.php?entity=userdata',user);
    }

    delete(id: number) {
        return this.http.delete(this.baseStubUrl + '/delete_user.php?id=' + id);
    }
}
