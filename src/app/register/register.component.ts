import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  samePw = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {
    // redirect to home if already logged in
    /*    if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }*/
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      user: ['', [Validators.required, Validators.email]],
      street: ['', Validators.minLength(3)],
      zip: ['', Validators.pattern(/^\d\d\d\d\d$/)],
      city: ['', Validators.minLength(3)],
      phone: ['', [Validators.maxLength(20), Validators.minLength(4), Validators.pattern(/^[0-9\- \/]*$/)]],
      speichern: [true, Validators.required],
      mailingliste: [false, Validators.required],
      password1: ['', [Validators.required, Validators.minLength(5)]],
      password2: ['', Validators.required],
    }, { validator: this.checkPasswords });
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
    const field = this.registerForm.get(fieldname);
    return field.hasError(errorType) && (field.dirty || field.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.register(this.registerForm.value, this.registerForm.get('password1').value)
      .pipe(first())
      .subscribe(
        data => {
          if (this.registerForm.get('mailingliste').value) {
            this.userService.aboniereMailinglise(this.registerForm.get('user').value).subscribe(bla => {
              this.loading = false;
              this.router.navigate(['/token/', this.registerForm.get('user').value, '-']);
            }, error => {
              this.loading = false;
              this.router.navigate(['/token/', this.registerForm.get('user').value, '-']);
            });
          } else {
            this.loading = false;
            this.router.navigate(['/token/', this.registerForm.get('user').value, '-']);
          }
        },
        error => {
          this.loading = false;
        });
  }

}
