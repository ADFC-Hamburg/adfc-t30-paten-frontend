import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../user';

@Injectable({ providedIn: 'root' })
export class StrassenlisteService {
  baseUrl = environment.API_STUB_BASE_URL;
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(this.baseUrl + '/strassenliste-get.php');
  }

}
