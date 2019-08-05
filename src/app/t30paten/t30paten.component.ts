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
    patenschaft: this.fb.group({
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
      this.currentUser = user;
    });
    this.route.params.subscribe(params => {
      console.log('x1', params);
      this.id = params['id'];
      if (String(this.id) !== '-1') {
        this.service.loadPatenschaft(this.id).subscribe(data => {
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
mein Name ist ${pate.firstName} ${pate.lastName}. Ich bin „Bezug zur Einrichtung“ der/des „Art der Einrichtung im Genitiv“   "${einr.name}", ${einr.zusatz}, ${einr.strasse}. Im Umfeld dieser Einrichtung fehlt leider noch Tempo 30.

Ich ersuche Sie hiermit, an diesem an die/das „Art der Einrichtung“ angrenzenden Straßenabschnitt Tempo 30 einzuführen:

„Straßenabschnitt 1“, Begründung:
Haupteingang zur Einrichtung und/oder Quell- und Zielverkehr

(Unzutreffendes bitte streichen, gerne durch Beschreibungen der Umstände vor Ort ergänzen)
Aus meiner Sicht sind die Kinder/ Schülerinnen/ Bewohnerinnen/ Patientinnen/ Besucherinnen, die im Umfeld der/des „Art der Einrichtung im Genitiv“ am Verkehr teilnehmen, nicht ausreichend vor dem schnellen KFZ-Verkehr geschützt. Die KFZ-Fahrer*innen müssen durch ein geringeres Tempo in die Lage versetzt werden, besondere Aufmerksamkeit walten zu lassen.

Die Änderung für den KFZ- „wenn Bus, dann : „und ggf. den Busverkehr halte“ ich angesichts des Sicherheitsgewinns für angemessen. Der Sicherheit muss Vorrang vor Geschwindigkeit gewährt werden.
„ggf. Begründung Bus Verlangsamung“ (Die Busse verlangsamen an der Stelle ohnehin wegen einer Bushaltestelle/der abbiegenden Buslinie ihre Fahrt.)

Laut § 45 Absatz 9 Satz 4 Ziffer 6 der StVO in Verbindung mit der Verwaltungsvorschrift zu § 45 StVO soll zum Schutz besonders schützenswerter Personen im Umfeld sozialer Einrichtungen, also dort wo Haupteingänge sind oder Quell- und Zielverkehr zur Einrichtung herrscht, regulär Tempo 30 gelten, ohne dass eine besondere Gefahrenlage erwiesen ist.

Vielen Dank und mit freundlichen Grüßen

${pate.firstName} ${pate.lastName}
${pate.street}
${pate.zip} ${pate.city}
${pate.phone}
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
