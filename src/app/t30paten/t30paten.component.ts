import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { T30sozialeEinrichtungComponent } from '../t30soziale-einrichtung/t30soziale-einrichtung.component';
import { T30PatenService } from '../t30-paten.service';
import { T30Pate } from '../t30pate';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-t30paten',
  templateUrl: './t30paten.component.html',
  styleUrls: ['./t30paten.component.css']
})
export class T30patenComponent implements OnInit {
  displayValidatorMarker = false;
    public currentUser: User = {
	firstName: '',
	lastName: '',
	user: '',
	city: '',
	zip: '',
	street: '',
	phone: '',
    };
  id = -1;
  t30pate = this.fb.group({
    id: [-1],
    mailSend: [false],
    sendMailNow: [false],
    einrichtung: T30sozialeEinrichtungComponent.buildItem(this.fb),
    patenschaft:   this.fb.group({
        standDerDinge: [''],
      }),
    email: this.fb.group({
        subject: ['', Validators.required],
        mailtext: ['', Validators.required]
    })
  });
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: T30PatenService,
    private userService: UserService,
) { }

  mainMenu() {
    // FIXME Fragen ob Änderungen wirklich verworfen werden sollen
    console.log(this.t30pate.dirty);
      this.router.navigate(['main']);
  }
    ngOnInit() {
	this.userService.getCurrentUser().subscribe(user => {
	    this.currentUser=user;
	});
    this.route.params.subscribe(params => {
      console.log('x1', params);
      this.id = params['id'];
      if (String(this.id) !== '-1') {
        this.service.loadPatenschaft(this.id).subscribe( data => {
          console.log(data);
          if (data.mailSend) {
            this.step = 1;
          } else {
            this.step = 2;
          }
          data.einrichtung.newLat = data.einrichtung.lat;
          data.einrichtung.newLon = data.einrichtung.lon;
          this.t30pate.get('email').get('mailtext').markAsDirty();
          this.t30pate.get('email').get('subject').markAsDirty();
          this.t30pate.setValue(data);
          if (data.mailSend) {
            console.log('disable');
            this.t30pate.get('email').get('subject').disable();
            this.t30pate.get('email').get('mailtext').disable();
          }
        });
      }
    });
    this.t30pate.valueChanges.subscribe(val => {
      const pate = this.currentUser;
      const einr = val.einrichtung;
      const newSubject = `Bitte um Prüfung von Tempo 30 vor der Einrichtung ${einr.name} ${einr.zusatz}`;
      if ((!this.t30pate.get('email').get('subject').dirty) && (newSubject !== val.email.subject)) {
          this.t30pate.get('email').get('subject').setValue(newSubject);
      }
      /* tslint:disable:max-line-length */
      const newEMailText = `Sehr geehrte Damen und Herren,
mein Name ist ${pate.vorname} ${pate.nachname} und mir ist aufgefallen, dass an der ${einr.name}, ${einr.zusatz} leider Tempo 50 ist.
Ich fordere Sie auf hier Tempo 30 einzuführen.

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.

At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

Viele Grüße

${pate.vorname} ${pate.nachname}

--
Diese E-Mail wurde durch das T30-Tool des ADFC-Hamburg verschickt, mehr Infos dazu unter
https://hamburg.adfc.de/hast-nicht-gesehen-FIXME `;
      /* tslint:disable:max-line-length */
      if ((!this.t30pate.get('email').get('mailtext').dirty) && (newEMailText !== val.email.mailtext)) {
        this.t30pate.get('email').get('mailtext').setValue(newEMailText);
      }

    });
  }
  validateAllFormFields(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(field => {
        this.validateAllFormFields(control.get(field));
      });
    } else if (control instanceof FormArray) {
      let i = 0;
      while (i < control.length) {
        this.validateAllFormFields(control.at(i));
        i++;
      }
    } else {
      console.error('Unkown Control: ', control);
    }
  }

  onSave(step: number, sendMail: boolean) {
    this.validateAllFormFields(this.t30pate);
    this.t30pate.get('id').setValue(this.id);
    this.t30pate.get('sendMailNow').setValue(sendMail);
    this.t30pate.get('patenschaft').markAsDirty();
    if (this.t30pate.valid) {
      this.service.savePatenschaft(new T30Pate(this.t30pate.value)).subscribe(results => {
        this.router.navigate(['main']);
      });
    } else {
      this.displayValidatorMarker = true;
    }
  }
}
