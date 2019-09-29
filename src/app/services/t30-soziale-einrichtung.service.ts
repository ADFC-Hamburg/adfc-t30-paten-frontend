import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SozialeEinrichtung } from '../sozialeEinrichtung';
import { AbstractCrudService } from './abstractCrud.service';

@Injectable({
  providedIn: 'root'
})
export class T30SozialeEinrichtungService extends AbstractCrudService<SozialeEinrichtung> {

  constructor(
    @Inject(HttpClient) protected http: HttpClient
  ) {
    super(http);
  }
  getEntityUrl() {
    return this.curdUrl + '?entity=institution';
  }

}
