import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { ForderungService } from '../forderung.service';
import { T30SozialeEinrichtungService } from '../t30-soziale-einrichtung.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { Point } from 'leaflet';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-forderung-edit',
  templateUrl: './forderung-edit.component.html',
  styleUrls: ['./forderung-edit.component.css']
})
export class ForderungEditComponent implements OnInit {
  id = -1;
  polizeirevierMail = 'Polizei Hamburg <polizei@hamburg.de>';
  public einrichtung: any = {
    'name': '',
    'zusatz': '',
    'art': 0,
    'strasse': '',
    'plz': '',
    'ort': '',
    'id': -1,
    'tempo30': 1,
    'angrenzendeStrassen': [],
  };
  public forderung: any = {
    'anmerkung': '',
    'anmerkung_bus': '',
    'bis': '',
    'busverkehr': '',
    'haupteingang': '1',
    'id': -1,
    'name': '',
    'spurigkeit': '',
    'status': '3',
    'von': '10'
  };
  forderungFG = this.fb.group({
    id: [-1],
    geprueft: ['1'],
    bezugZurEinrichtung: ['', Validators.required],
    standDerDinge: [''],
    mailSend: [false],
    sendMailNow: [false],
    password: ['', Validators.required],
    subject: ['', Validators.required],
    mailtext: ['', Validators.required]
  });

  ART_STR = [
    'Unklar',
    'Kindergaten',
    'Schule',
    'Alten-, Pflege- und Tagespflegeheim',
    'Krankenhaus',
  ];
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
  BESUCHER_ART = [
    'die Kinder/ Schülerinnen/ Bewohnerinnen/ Patientinnen/ Besucherinnen, die im Umfeld der/des <Art der Einrichtung im Genitiv>',
    'die Kinder die im Umfeld des Kindergatens',
    'die Kinder die im Umfeld der Schule',
    'die Senioren die im Umfeld des Heims',
    'die Patentent*innen und Besucher*innen die im Umfeld des Krankehaueses',
  ];
  STATUS = [
    'unklar',
    'hier wird Tempo 30gefordert',
    'hier ist Tempo 30',
    'hier fehlt Tempo 30',
    'die Behörde hat Tempo 30 abgelehnt',
    'Tempo 30 wurde angeordnet, die Schilder stehen aber noch nicht',
  ];
  BUSVERKEHR = [
    'Unklar',
    'Kein Busverkehr',
    'weniger als 6 mal/h',
    '6 mal/h oder mehr'
  ];
  HAUPTEINGANG = [
    'An- und Abreiseverkehr',
    'Haupteingang',
    'Haupteingang und An- und Abreiseverkehr',
  ];
  SPURIGKEIT = [
    'Je eine Spur je Fahrtrichtung',
    'Mehr als eine Spur je Fahrtrichtung'
  ];
  public currentUser: User = {
    firstName: '',
    lastName: '',
    user: '',
    city: '',
    zip: '',
    street: '',
    phone: '',
  };
  public tileLayerUrl: string = OSM_TILE_LAYER_URL;
  public marker = {
    draggable: true,
    iconSize: new Point(25, 41),
    iconAnchor: new Point(12, 41),
    popupAnchor: new Point(1, -34),
    tooltipAnchor: new Point(16, -28),
    shadowSize: new Point(41, 41)
  };
  constructor(
    private route: ActivatedRoute,
    private forderungService: ForderungService,
    private sozService: T30SozialeEinrichtungService,
    private fb: FormBuilder,
    private userService: UserService
  ) { }
  genEMailText() {
    const user = this.currentUser;
    const einr = this.einrichtung;
    const forderung = this.forderung;

    let newEMailText = 'Sehr geehrte Damen und Herren,\n' +
      `mein Name ist ${user.firstName} ${user.lastName}. ` +
      `Ich bin ${this.forderungFG.get('bezugZurEinrichtung').value} ${this.BEZUG_ART[einr.art]} "${einr.name}", `;
    if (einr.zusatz !== '') {
      newEMailText = newEMailText + einr.zusatz + ', ';
    }
    newEMailText = newEMailText +
      `${einr.strasse}, ${einr.plz} ${einr.ort}.\nIm Umfeld dieser Einrichtung fehlt leider noch Tempo 30.\n\n` +
      `Ich ersuche Sie hiermit, an diesem an ${this.ANGR_ART[einr.art]} angrenzenden Straßenabschnitt ` +
      `${forderung.name} von Hausnummer ${forderung.von} bis Hausnummer ${forderung.bis} Tempo 30 einzuführen.\n\n` +
      `Begründung:\n${this.HAUPTEINGANG[forderung.haupteingang]}\n\n` +
      forderung.anmerkung + '\n\n' +
      '(gerne durch Beschreibungen der Umstände vor Ort ergänzen)\n\n' +
      `Aus meiner Sicht sind ${this.BESUCHER_ART[einr.art]} am Verkehr teilnehmen, nicht ausreichend vor dem schnellen ` +
      'KFZ-Verkehr geschützt.\nDie KFZ-Fahrer*innen müssen durch ein geringeres Tempo in die Lage versetzt werden, ' +
      'besondere Aufmerksamkeit walten zu lassen.\n';

    if (forderung.busverkehr > 1) {
      newEMailText = newEMailText + 'Die Änderung für den KFZ- und Busverkehr';
    } else {
      newEMailText = newEMailText + 'Die Änderung für den KFZ-Verkehr';
    }
    newEMailText = newEMailText + 'halte ich angesichts des Sicherheitsgewinns für angemessen. ' +
      'Der Sicherheit muss Vorrang vor Geschwindigkeit gewährt werden.\n\n' +
      forderung.anmerkung_bus + '\n\n' +
      'Laut §45 Absatz 9 Satz 4 Ziffer 6 der StVO in Verbindung mit der Verwaltungsvorschrift zu ' +
      '§45 StVO soll zum Schutz besonders schützenswerter Personen im Umfeld sozialer Einrichtungen,\n' +
      'also dort wo Haupteingänge sind oder Quell- und Zielverkehr zur Einrichtung herrscht, regulär Tempo 30 ' +
      'gelten, ohne dass eine besondere Gefahrenlage erwiesen ist.\n\nVielen Dank und mit freundlichen Grüßen\n\n' +
      `${user.firstName} ${user.lastName}\n\n` +
      `${user.street}\n` +
      `${user.zip} ${user.city}\n` +
      `${user.phone}\n\n` +
      '--\nDiese E-Mail wurde durch das Tempo 30-Tool des ADFC-Hamburg verschickt, mehr Infos dazu unter\n' +
      'https://hamburg.adfc.de/hast-nicht-gesehen-FIXME';
    console.log('gen-email');
    if ((!this.forderungFG.get('mailtext').dirty) && (newEMailText !== this.forderungFG.get('mailtext').value)) {
      this.forderungFG.get('mailtext').setValue(newEMailText);
    }
  }
  ngOnInit() {
    this.forderungFG.get('bezugZurEinrichtung').valueChanges.subscribe(bezug => {
      this.genEMailText();
    });
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
        this.currentUser = user;
        this.forderungService.get(param.id).pipe(take(1)).subscribe(forderung => {
          this.forderung = forderung;
          if (forderung.einrichtung) {
            this.sozService.get(forderung.einrichtung).pipe(take(1)).subscribe(einr => {
              this.einrichtung = einr;
              const newSubject = `Bitte um Prüfung von Tempo 30 vor der Einrichtung ${einr.name} ${einr.zusatz}`;
              if ((!this.forderungFG.get('subject').dirty) && (newSubject !== this.forderungFG.get('subject').value)) {
                this.forderungFG.get('subject').setValue(newSubject);
              }
              this.genEMailText();

            });
          }
        });
      });
    });
  }
}
