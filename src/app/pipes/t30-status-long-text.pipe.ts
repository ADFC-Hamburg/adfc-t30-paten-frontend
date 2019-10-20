import { Pipe, PipeTransform } from '@angular/core';

const LONG_TEXT = [
  'Bitte prüfen und Angaben machen.', /*0*/
  'Tempo 30 fehlt, Forderung gestellt.', /*1*/
  'OK.', /*2*/
  'Tempo 30 fehlt, Forderung wurde noch nicht gestellt', /*3*/
  'Tempo 30 abgelehnt.', /*4*/
  'Tempo 30 angeordnet, Schilder fehlen noch.', /* 5*/
];
@Pipe({
  name: 't30StatusLongText'
})
export class T30StatusLongTextPipe implements PipeTransform {

  transform(value: number): string {
    if ((value < 0) || (value > 5)) {
      return '?';
      console.error('Unknown Status', value);
    }
    return LONG_TEXT[value];
  }
}
