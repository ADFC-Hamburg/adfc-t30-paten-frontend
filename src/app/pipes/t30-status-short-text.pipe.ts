import { Pipe, PipeTransform } from '@angular/core';

import { STATUS_TEXT } from '../const';

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
