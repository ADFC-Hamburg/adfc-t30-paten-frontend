import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanDeactivateComponent } from './can-deactivate/can-deactivate.component';


@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent>   {
  canDeactivate(component: CanDeactivateComponent): boolean {
    if (typeof component.canDeactivate === 'function') {
      if (!component.canDeactivate()) {
        return confirm('Willst du die Seite wirklich verlassen, ohne die letzten Änderungen zu speichern?');
      }
    }
    return true;
  }
}
