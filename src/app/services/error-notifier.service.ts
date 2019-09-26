import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// see: https://javaeeblog.wordpress.com/2017/06/23/angular-http-error-handler/

@Injectable({
  providedIn: 'root'
})
export class ErrorNotifierService {
  public messages = new Subject<string>();
  public addError(error: string) {
    this.messages.next(error);
  }
  constructor() { }
}
