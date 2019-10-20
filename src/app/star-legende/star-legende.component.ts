import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-legende',
  templateUrl: './star-legende.component.html',
  styleUrls: ['./star-legende.component.css']
})
export class StarLegendeComponent implements OnInit {

  showLegendeVal = false;

  @Input()
  get showLegende() {
    return this.showLegendeVal;
  }

  @Output() showLegendeChange = new EventEmitter();

  set showLegende(val) {
    this.showLegendeVal = val;
    this.showLegendeChange.emit(this.showLegendeVal);
  }
  LEGENDE_TEXT = [
    'Bitte prüfen, d. h. ggf. vor Ort relevante Straßenabschnitte im Umfeld der ' +
    'Einrichtung überprüfen und deren Tempo-30-Status eingeben.',

    'Mail versenden. Hier wurde noch nicht für alle relevanten Straßenabschnitte ' +
    'im Umfeld der Einrichtung ohne Tempo 30 eine Mail versandt.',

    'Forderung gestellt. Für alle relevanten Straßenabschnitte im Umfeld der ' +
    'Einrichtung ohne Tempo 30 wurde bereits eine Mail versandt.',

    'Umsetzung beobachten. An mindestens einem relevanten Straßenabschnitt im ' +
    'Umfeld der Einrichtung wurde Tempo 30 bereits angeordnet, aber noch nicht eingeführt.',

    'OK. An allen relevanten Straßenabschnitten im Umfeld der Einrichtung gilt Tempo 30.',

    'Abgelehnt. Für mindestens einen relevanten Straßenabschnitt im ' +
    'Umfeld der Einrichtung hat die Behörde Tempo 30 abgelehnt.'

  ];
  constructor() { }

  ngOnInit() {
  }

}
