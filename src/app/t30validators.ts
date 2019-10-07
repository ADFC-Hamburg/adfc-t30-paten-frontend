import { FormGroup } from '@angular/forms';

export class T30Validators {
  static checkPasswords(fg: FormGroup): boolean {
    // here we have the 'passwords' group
    const pw1 = fg.get('password1').value;
    const pw2 = fg.get('password2').value;
    const samePw = (pw1 === pw2);
    if (samePw) {
      fg.get('password2').setErrors(null);
    } else {
      fg.get('password2').setErrors({
        notMatched: true
      });
    }
    return samePw;
  }
}
