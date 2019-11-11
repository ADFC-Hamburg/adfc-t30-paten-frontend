import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// see: https://javaeeblog.wordpress.com/2017/06/23/angular-http-error-handler/

export enum AppNotificationType {
  Clear,
  Error,
  Success,
}
export class AppNotification {
  public type: AppNotificationType;
  public msg: string;
  public duration: number;
  public isClear() {
    return this.type === AppNotificationType.Clear;
  }
  public isError() {
    return this.type === AppNotificationType.Error;
  }
  public isSuccess() {
    return this.type === AppNotificationType.Success;
  }
  public getMessage() {
    return this.msg;
  }
}
@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  public messages = new Subject<AppNotification>();
  private addMsg(type: AppNotificationType, msg: string, duration: number) {
    const notification = new AppNotification();
    notification.type = type;
    notification.msg = msg;
    notification.duration = duration;
    this.messages.next(notification);
  }
  public addError(error: string) {
    this.addMsg(AppNotificationType.Error, error, 4000);
  }
  public addSuccess(msg: string) {
    this.addMsg(AppNotificationType.Success, msg, 10000);
  }
  public clearAllErrrors() {
    this.addMsg(AppNotificationType.Clear, '', 0);
  }
}
