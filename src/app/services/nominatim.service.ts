import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { NotificationError } from '../notification-error';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  constructor(private http: HttpClient) { }

  getPosition(street_house_no: string, zip: string, city: string) {
    return this.http.get<any>(
      'https://nominatim.openstreetmap.org/search' +
      '?city=' + encodeURIComponent(city) +
      '&street=' + encodeURIComponent(street_house_no) +
      '&postalcode=' + encodeURIComponent(zip) +
      '&country_codes=de&format=json'
    ).pipe(map(res => {
      if (res.length === 0) {
        throw new NotificationError('Die Position konnte nicht gefunden werden');
      }
      return [res[0].lon, res[0].lat];
    }));
  }
}
