import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';
import { NgForm } from '@angular/forms';
export abstract class CanDeactivateFormComponent extends CanDeactivateComponent {

  abstract get form(): NgForm;

  canDeactivate(): boolean {
    return this.form.submitted || !this.form.dirty;
  }
}
