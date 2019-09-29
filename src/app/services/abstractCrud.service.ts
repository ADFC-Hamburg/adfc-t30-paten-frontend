import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BasicType } from '../basicType';
import { BasicCrudResponse } from '../basicCrudResponse';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-T30-Frontend-Version': environment.VERSION,
    'X-T30-Frontend-Production': String(environment.production),
    // 'Authorization': 'my-auth-token'
  })
};

export abstract class AbstractCrudService<T extends BasicType> {
  curdUrl = environment.API_BASE_URL + 'crud.php';

  constructor(
    protected http: HttpClient,
  ) {
  }

  abstract getEntityUrl(): string;

  getGetUrl(id: number) {
    return this.getEntityUrl() + '&refs=(format,data)&nores=[]&filter=[id,\'' + id + '\']';
  }
  getListUrl() {
    return this.getEntityUrl() + '&refs=(format,data)&nores=[]';
  }
  getCreateUrl() {
    return this.getEntityUrl();
  }
  getUpdateUrl() {
    return this.getEntityUrl();
  }
  get(id: number): Observable<T> {
    return this.http.get<T>(this.getGetUrl(id), httpOptions).pipe(
      map(data => {
        return data[0];
      }));
  }
  list(): Observable<T[]> {
    return this.http.get<T[]>(this.getListUrl(), httpOptions);
  }
  create(data: T): Observable<BasicCrudResponse> {
    return this.http.post<BasicCrudResponse>(this.getCreateUrl(), data, httpOptions);
  }
  update(data: T): Observable<BasicCrudResponse> {
    return this.http.put<BasicCrudResponse>(this.getUpdateUrl(), data, httpOptions);
  }
  save(data: T): Observable<BasicCrudResponse> {
    if ((data.id === -1) || (data.id == null)) {
      data.id = null;
      return this.create(data);
    } // else
    return this.update(data);
  }
}
