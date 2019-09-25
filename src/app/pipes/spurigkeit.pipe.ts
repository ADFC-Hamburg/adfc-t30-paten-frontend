import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spurigkeit'
})
export class SpurigkeitPipe implements PipeTransform {

  SPURIGKEIT_STR = [
    'Je eine KFZ-Spur je Fahrtrichtung',
    'Mehr als eine KFZ-Spur je Fahrtrichtung'
  ];

  transform(value: number): string {
    return this.SPURIGKEIT_STR[value];
  }

}
