import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CanDeactivateFormControlComponent } from '../can-deactivate-form-control/can-deactivate-form-control.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  extends CanDeactivateFormControlComponent implements OnInit {
    profileForm: FormGroup;
    loading = false;
  disable = true;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    ) {
      super();
   }
  getFormControl() {
    return this.profileForm;
  }
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        user: ['', [ Validators.required, Validators.email ]],
        street: ['', Validators.minLength(3)],
        zip: ['', Validators.pattern(/^\d\d\d\d\d$/)],
        city: ['', Validators.minLength(3)],
        phone: ['', [  Validators.maxLength(20), Validators.minLength(4), Validators.pattern(/^[0-9\- \/]*$/)]],
        save: [true, Validators.required],
        change_pw: [false, Validators.required],
        password1: [{value: '', disabled: true}, [ Validators.required, Validators.minLength(5)]],
        password2: [{value: '', disabled: true}, [ Validators.required ] ],
    }, {validator: this.checkPasswords});
     this.profileForm.get('change_pw').valueChanges.subscribe(value => {
       const pwFields = [  'passwort1', 'passwort2' ];
       if (value) {
         pwFields.forEach( field => {
           this.profileForm.controls[field].enable();
         });
       } else {
         pwFields.forEach( field => {
           this.profileForm.controls[field].disable();
         });
        }

      });
      this.userService.getCurrentUser().subscribe( data => {
	  console.log(data);
        this.profileForm.patchValue(data);
      });
  }
  checkPasswords(fg: FormGroup) { // here we have the 'passwords' group
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
  checkValidateError(fieldname: string, errorType: string): boolean {
    const field =  this.profileForm.get(fieldname);
    return field.hasError(errorType) && (field.dirty || field.touched || this.submitted);
  }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.profileForm.invalid) {
          return;
      }
      console.log(this.router); // FIXME
      this.loading = true;
     this.userService.register(this.profileForm.value)
          .pipe(first())
          .subscribe(
              data => {
                  this.router.navigate(['/token/:fehler']);
              },
              error => {
                  this.loading = false;
              });
  }
}
