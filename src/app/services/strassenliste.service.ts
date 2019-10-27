import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
const CACHE_SIZE = 1;
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
  private cache$: Observable<string[]>;

  baseUrl = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

  convertEntry(street_entry) {
    return street_entry.street_name;
  }
  public getAll(): Observable<string[]> {
    if (!this.cache$) {
      this.cache$ = this.requestAll().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cache$;
  }
  private requestAll(): Observable<string[]> {
    return this.http.get<StreetEntry[]>(this.baseUrl + 'crud.php?entity=street', httpOptions)
      .pipe(
        map(res => {
          return res.map(this.convertEntry);
        }));
  }
}
