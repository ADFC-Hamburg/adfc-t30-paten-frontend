import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ErrorHandleService } from '../error-handle.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private errorHandleService: ErrorHandleService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUser) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      password1: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(5)]],
      password2: [{ value: '', disabled: true }, [Validators.required]],
      passwordResend: [false]
    }, { validator: this.checkPasswords });
    this.loginForm.get('password1').disable();
    this.loginForm.get('password2').disable();
    this.loginForm.get('passwordResend').valueChanges.subscribe(val => {
      if (val) {
        this.loginForm.get('password').disable();
        this.loginForm.get('password1').enable();
        this.loginForm.get('password2').enable();
      } else {
        this.loginForm.get('password').enable();
        this.loginForm.get('password1').disable();
        this.loginForm.get('password2').disable();
      }
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    const field = this.loginForm.get(fieldname);
    console.log(field, fieldname);
    return field.hasError(errorType) && (field.dirty || field.touched || this.submitted);

  }

  get passwordResend() {
    return this.loginForm.get('passwordResend').value;
  }

  isDefaultReturnUrl() {
    return (this.returnUrl === '/');
  }
  // convenience getter for easy access to form fields
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('xx');
    if (this.loginForm.get('passwordResend').value) {
      this.authenticationService.passwordReset(this.loginForm.get('email').value, this.loginForm.get('password1').value).pipe(first())
        .subscribe(
          data => {
            this.errorHandleService.handleError('Sofern Ihre E-Mail korrekt war, ' +
              'haben Ihnen einen Link zum neu setzen des Passwortes geschickt');
            this.loading = false;
          },
          error => {
            this.errorHandleService.handleError('Fehler ' + error);
            this.loading = false;
          }
        );
    } else {
      this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .pipe(first())
        .subscribe(
          data => {
            console.log('okay');
            this.router.navigate([this.returnUrl]);
          },
          error => {
            console.log('err', error);
            this.errorHandleService.handleError(error);
            this.loading = false;
          });
    }
  }
}
