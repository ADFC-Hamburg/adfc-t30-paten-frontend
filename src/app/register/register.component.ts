﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../user.service';

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
            vorname: ['', Validators.required],
            nachname: ['', Validators.required],
            email: ['', [ Validators.required, Validators.email ]],
            strasse: ['', Validators.minLength(3)],
            plz: ['', Validators.pattern(/^\d\d\d\d\d$/)],
            ort: ['', Validators.minLength(3)],
            telefon: ['', [  Validators.maxLength(20), Validators.minLength(4), Validators.pattern(/^[0-9\- \/]*$/)]],
            speichern: [true, Validators.required],
            mailingliste: [false, Validators.required],
            newsletter: [false, Validators.required],
            passwort1: ['', [Validators.required, Validators.minLength(5)]],
            passwort2: ['', Validators.required],
        }, {validator: this.checkPasswords});
    }
    checkPasswords(fg: FormGroup) { // here we have the 'passwords' group
      const pw1 = fg.get('passwort1').value;
      const pw2 = fg.get('passwort2').value;
      const samePw = (pw1 === pw2);
      if (samePw) {
        fg.get('passwort2').setErrors(null);
      } else {
        fg.get('passwort2').setErrors({
           notMatched: true
        });
      }
      return samePw;
    }
    checkValidateError(fieldname: string, errorType: string): boolean {
      const field =  this.registerForm.get(fieldname);
      return field.hasError(errorType) && (field.dirty || field.touched || this.submitted);
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        console.log(this.router); // FIXME
        this.loading = true;
       this.userService.register(this.registerForm.value)
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
