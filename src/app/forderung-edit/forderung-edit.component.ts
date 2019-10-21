import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForderungService } from '../services/forderung.service';
import { DemandedStreetSectionService } from '../services/demanded-street-section.service';
import { CanDeactivateFormControlComponent } from '../can-deactivate-form-control/can-deactivate-form-control.component';
import { RelationInstitutionService } from '../services/relation-institution.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forderung-edit',
  templateUrl: './forderung-edit.component.html',
  styleUrls: ['./forderung-edit.component.css']
})
export class ForderungEditComponent extends CanDeactivateFormControlComponent implements OnInit {
  id = -1;
  relationId = -1;
  CONTACT_MAIL = environment.CONTACT_MAIL;
  public einrichtung: any = {
    'name': '',
    'type': 0,
    'street_house_no': '',
    'streetsection_complete': false,
    'city': '',
    'id': -1
  };
  public streetSection: any = {};

  forderungFG = this.fb.group({
    id: [-1],
    geprueft: ['1'],
    bezugZurEinrichtung: ['', Validators.required],
    mailSend: [false],
    sendMailNow: [false],
    password: ['', Validators.required],
    mail_subject: ['', Validators.required],
    mail_start: ['', Validators.required],
    mail_body: ['', Validators.required],
    mail_end: ['', Validators.required]
  });

  BEZUG_ART = [
    'der/des <Art der Einrichtung im Genitiv>',
    'des Kindergatens',
    'der Schule',
    'des Alten-, Pflege- und Tagespflegeheims',
    'des Krankehaueses'
  ];
  ANGR_ART = [
    'die/das <Art der Einrichtung>',
    'den Kindergaten',
    'die Schule',
    'das Alten-, Pflege- und Tagespflegeheim',
    'das Krankenhaus'
  ];
  ART = [
    '',
    'Kingertagesstätte',
    'Schule',
    'Alten- und Pflegeheim',
    'Krankenhaus'
  ];
  BESUCHER_ART = [
    'die Kinder/ Schülerinnen/ Bewohnerinnen/ Patientinnen/ Besucherinnen, die im Umfeld der/des <Art der Einrichtung im Genitiv>',
    'die Kinder die im Umfeld des Kindergatens',
    'die Kinder die im Umfeld der Schule',
    'die Senioren die im Umfeld des Heims',
    'die Patentent*innen und Besucher*innen die im Umfeld des Krankehaueses',
  ];

  HAUPTEINGANG = [
    'An- und Abreiseverkehr',
    'Haupteingang',
    'Haupteingang und An- und Abreiseverkehr',
  ];
  public currentUser: User = {
    id: -1,
    firstName: '',
    lastName: '',
    user: '',
    city: '',
    zip: '',
    street_house_no: '',
    phone: '',
  };
  public isPasswordOkay = 0;
  public aktionsData = {
    reached: true,
    until: new Date(),
  };
  public polizeiData = {
    name: '',
    email: ''
  };
  public changeData = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forderungService: ForderungService,
    private fb: FormBuilder,
    private userService: UserService,
    private demandedStreetSectionService: DemandedStreetSectionService,
    private relationInstitutionService: RelationInstitutionService,
  ) {
    super();
  }
  getFormControl() {
    return this.forderungFG;
  }
  genEMailStartText() {
    const user = this.currentUser;
    const einr = this.einrichtung;

    let newEMailText = 'Sehr geehrte Damen und Herren,\n' +
      `mein Name ist ${user.firstName} ${user.lastName}. ` +
      `Ich bin ${this.forderungFG.get('bezugZurEinrichtung').value} ${this.BEZUG_ART[einr.type]} "${einr.name}", `;
    newEMailText = newEMailText +
      `${einr.street_house_no}, ${einr.zip} ${einr.city}.`;
    if ((!this.forderungFG.get('mail_start').dirty) && (newEMailText !== this.forderungFG.get('mail_start').value)) {
      this.forderungFG.get('mail_start').setValue(newEMailText);
    }

  }
  genEMailEndText() {
    const user = this.currentUser;
    const newEMailText = 'Vielen Dank und mit freundlichen Grüßen\n\n' +
      `${user.firstName} ${user.lastName}\n\n` +
      `${user.street_house_no}\n` +
      `${user.zip} ${user.city}\n\n` +
      '--\nDiese E-Mail wurde durch das Tempo 30-Tool des ADFC-Hamburg verschickt, mehr Infos dazu unter:\n' +
      environment.CAMPAIN_URL;
    if ((!this.forderungFG.get('mail_end').dirty) &&
      (newEMailText !== this.forderungFG.get('mail_end').value)) {
      this.forderungFG.get('mail_end').setValue(newEMailText);
    }

  }
  genEMailText() {
    const einr = this.einrichtung;
    const streetSection = this.streetSection;
    console.log(streetSection);
    let newEMailText = `Im Umfeld dieser Einrichtung fehlt leider noch Tempo 30.\n\n` +
      `Ich ersuche Sie hiermit, an diesem an ${this.ANGR_ART[einr.type]} angrenzenden Straßenabschnitt ` +
      `${streetSection.street} von Hausnummer/Kreuzung ${streetSection.house_no_from} bis Hausnummer/Kreuzung ` +
      `${streetSection.house_no_to} Tempo 30 einzuführen.\n\n` +
      `Begründung:\n${this.HAUPTEINGANG[streetSection.entrance]}\n\n` +
      streetSection.user_note + '\n\n' +
      '(gerne durch Beschreibungen der Umstände vor Ort ergänzen)\n\n' +
      `Aus meiner Sicht sind ${this.BESUCHER_ART[einr.type]} am Verkehr teilnehmen, nicht ausreichend vor dem schnellen ` +
      'KFZ-Verkehr geschützt.\nDie KFZ-Fahrer*innen müssen durch ein geringeres Tempo in die Lage versetzt werden, ' +
      'besondere Aufmerksamkeit walten zu lassen.\n';

    if (streetSection.much_bus_traffic > 1) {
      newEMailText = newEMailText + 'Die Änderung für den KFZ- und Busverkehr';
    } else {
      newEMailText = newEMailText + 'Die Änderung für den KFZ-Verkehr';
    }
    newEMailText = newEMailText + 'halte ich angesichts des Sicherheitsgewinns für angemessen. ' +
      'Der Sicherheit muss Vorrang vor Geschwindigkeit gewährt werden.\n\n' +
      streetSection.reason_slower_buses + '\n\n' +
      'Laut §45 Absatz 9 Satz 4 Ziffer 6 der StVO in Verbindung mit der Verwaltungsvorschrift zu ' +
      '§45 StVO soll zum Schutz besonders schützenswerter Personen im Umfeld sozialer Einrichtungen,\n' +
      'also dort wo Haupteingänge sind oder Quell- und Zielverkehr zur Einrichtung herrscht, regulär Tempo 30 ' +
      'gelten, ohne dass eine besondere Gefahrenlage erwiesen ist.';
    console.log('gen-email');
    if ((!this.forderungFG.get('mail_body').dirty) && (newEMailText !== this.forderungFG.get('mail_body').value)) {
      this.forderungFG.get('mail_body').setValue(newEMailText);
    }
  }
  onSave(sendMailNow) {
    console.log(this.forderungFG.value);
    let call;
    const data = this.forderungFG.value;
    data.person = this.currentUser.id;
    data.demanded_street_section = this.id;
    data.sendMailNow = sendMailNow;
    let emailId = this.forderungFG.get('id').value;
    if (emailId === -1) {
      call = this.forderungService.create(data);
    } else {
      call = this.forderungService.update(data);
    }
    call.subscribe(rtnData => {
      this.setSubmitted();
      if (sendMailNow) {
        if (emailId === -1) {
          console.log(rtnData);
          emailId = rtnData.id;
        }
        this.forderungService.sendMail(emailId).subscribe(rtnMailSend => {
          this.router.navigate(['/einrichtung/view', this.einrichtung.id]);
        });
      } else {
        this.router.navigate(['/einrichtung/view', this.einrichtung.id]);
      }
    });
    const relationData = {
      relation_type: this.forderungFG.get('bezugZurEinrichtung').value,
      person: this.currentUser.id,
      institution: this.einrichtung.id,
      id: this.relationId
    };
    if (this.relationId === -1) {
      delete relationData.id;
      this.relationInstitutionService.create(relationData).subscribe(rtn => {
        console.log(rtn);
        localStorage.setItem('recalc_main_link', '1');
      });
    } else {
      this.relationInstitutionService.update(relationData).subscribe(rtn => {
        console.log(rtn);
      });
    }
  }
  mainMenu() {
    this.router.navigate(['/einrichtung/view', this.einrichtung.id]);
  }
  onPasswordChange(password: string) {
    this.forderungService.validateAktionsPassword(this.einrichtung.type, password).subscribe(rtn => {
      this.isPasswordOkay = rtn;
      console.log(rtn);
    });
  }
  ngOnInit() {
    this.forderungFG.get('bezugZurEinrichtung').valueChanges.subscribe(bezug => {
      this.genEMailStartText();
    });
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
        this.currentUser = user;
        if (this.currentUser.phone == null) {
          this.currentUser.phone = '';
          this.forderungService.getChangeInfo(user.user, param.id).subscribe(changeData => {
            this.changeData = changeData;
          });
        }
        this.forderungService.get(param.id, user.id).subscribe(forderung => {
          this.demandedStreetSectionService.get(param.id).pipe(take(1)).subscribe(streetSection => {
            this.streetSection = streetSection[0];
            console.log(streetSection);
            console.log(this.einrichtung);
            this.einrichtung = this.streetSection.institution;
            console.log(this.einrichtung);
            const einr = this.einrichtung;
            this.relationInstitutionService.get(einr.id, this.currentUser.id).subscribe(relInsData => {
              console.log(relInsData);
              if (relInsData.length > 0) {
                this.relationId = relInsData[0].id;
                this.forderungFG.get('bezugZurEinrichtung').setValue(relInsData[0].relation_type);
              }
            });
            this.forderungService.getAktionsData(this.einrichtung.type).subscribe(aktionsData => {
              this.aktionsData.reached = aktionsData.reached;
              if (this.aktionsData.reached) {
                this.isPasswordOkay = 1;
              }
              this.aktionsData.until = new Date(aktionsData.until + 'T00:00:00');
            });
            this.forderungService.getPK(einr.id).subscribe(polizeiData => {
              this.polizeiData = polizeiData[0];
            });
            if (forderung.length === 1) {
              this.forderungFG.patchValue(forderung[0]);
              this.forderungFG.get('geprueft').setValue('2');
            } else {
              const newSubject = 'Tempo 30 für ' + this.streetSection.street + ' ' + this.streetSection.house_no_from +
                ' bis ' + this.streetSection.house_no_to + ' an ' + einr.name;
              this.forderungFG.get('mail_subject').setValue(newSubject);
              this.genEMailStartText();
              this.genEMailText();
              this.genEMailEndText();
            }
          });
        });
      });
    });
  }
}
