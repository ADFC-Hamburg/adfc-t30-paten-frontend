import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class StreetEntry {
  public street_name: String;
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-T30-Frontend-Version': environment.VERSION,
    'X-T30-Frontend-Production': String(environment.production),
    // 'Authorization': 'my-auth-token'
  })
};
@Injectable({ providedIn: 'root' })
export class StrassenlisteService {
  baseUrl = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

  convertEntry(street_entry) {
    return street_entry.street_name;
  }
  getAll(): Observable<string[]> {
    return this.http.get<StreetEntry[]>(this.baseUrl + 'crud.php?entity=street', httpOptions)
      .pipe(
        map(res => {
          return res.map(this.convertEntry);
        }));
  }
}
