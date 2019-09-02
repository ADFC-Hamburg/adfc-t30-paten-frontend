import { Pipe, PipeTransform } from '@angular/core';

const STATUS_TEXT = [
  'Bitte checken.',
  'Tempo 30 gefordert.',
  'OK.',
  'Handlungsbedarf.',
  'Abgelehnt!',
  'Umsetzung Beobachten.',
];

@Pipe({
  name: 't30StatusShortText'
})
export class T30StatusShortTextPipe implements PipeTransform {

  transform(value: number): string {
    if ((value < 0) || (value > 5)) {
      return '?';
      console.error('Unknown Status', value);
    }
    return STATUS_TEXT[value];
  }

}
