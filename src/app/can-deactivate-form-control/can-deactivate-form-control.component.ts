import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';
import { AbstractControl } from '@angular/forms';

export abstract class CanDeactivateFormControlComponent extends CanDeactivateComponent {

  private canDeactivateSubmited = false;

  abstract getFormControl(): AbstractControl;

  public setSubmitted() {
    this.canDeactivateSubmited = true;
  }

  canDeactivate(): boolean {
    return this.canDeactivateSubmited || this.getFormControl().pristine || !this.getFormControl().dirty;
  }
}
