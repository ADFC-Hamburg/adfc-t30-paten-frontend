import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { CanDeactivateFormControlComponent } from '../can-deactivate-form-control/can-deactivate-form-control.component';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';
import { T30Validators } from '../t30validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends CanDeactivateFormControlComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  disable = true;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
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
      user: ['', [Validators.required, Validators.email]],
      street_house_no: ['', Validators.minLength(3)],
      zip: ['', Validators.pattern(/^\d\d\d\d\d$/)],
      city: ['', Validators.minLength(3)],
      phone: ['', [Validators.maxLength(20), Validators.minLength(4), Validators.pattern(/^[0-9\- \/]*$/)]],
      save: [true, Validators.required],
      change_pw: [false, Validators.required],
      password1: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(5)]],
      password2: [{ value: '', disabled: true }, [Validators.required]],
    }, { validator: T30Validators.checkPasswords });
    this.profileForm.get('change_pw').valueChanges.subscribe(value => {
      const pwFields = ['password1', 'password2'];
      if (value) {
        pwFields.forEach(field => {
          this.profileForm.controls[field].enable();
        });
      } else {
        pwFields.forEach(field => {
          this.profileForm.controls[field].disable();
        });
      }

    });
    this.userService.getCurrentUser().subscribe(data => {
      console.log(data);
      this.profileForm.patchValue(data);
    });
  }
  checkValidateError(fieldname: string, errorType: string): boolean {
    const field = this.profileForm.get(fieldname);
    return field.hasError(errorType) && (field.dirty || field.touched || this.submitted);
  }
  openMailinglist() {
    window.open('https://ml-cgn06.ispgateway.de/mailman/listinfo/soziale-t30_lists.hamburg.adfc.de/', '_blank');
  }
  deleteProfile() {
    confirm('Bitte wende dich per E-Mail an' + environment.CONTACT_MAIL);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }
    console.log(this.router); // FIXME
    this.loading = true;

    this.userService.update(this.profileForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (this.profileForm.get('change_pw').value) {
            console.log(this.authenticationService.changePassword);
            this.authenticationService.changePassword(this.profileForm.get('password1').value).subscribe(
              data2 => {
                this.setSubmitted();
                this.router.navigate(['/main']);
              });
          } else {
            this.setSubmitted();
            this.router.navigate(['/main']);
          }
        },
        error => {
          this.loading = false;
        });
  }
}
