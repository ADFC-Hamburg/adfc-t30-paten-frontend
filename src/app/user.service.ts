import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl = environment.API_BASE_URL;
  baseStubUrl = environment.API_STUB_BASE_URL;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(this.baseStubUrl + '/get_all_users.php');
    }

    getById(id: number) {
        return this.http.get(this.baseStubUrl + '/get_user.php?id=' + id);
    }

    getCurrentUser() {
      return this.http.get(this.baseStubUrl + '/get_current_user.php');
    }

    register(user: User) {
        const merged = Object.assign(user, {concern: 'register'})
        return this.http.post(this.baseUrl + '/portal.php', merged);
    }

    update(user: User) {
        return this.http.put(this.baseStubUrl + '/change_user.php?id=' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(this.baseStubUrl + '/delete_user.php?id=' + id);
    }
}
