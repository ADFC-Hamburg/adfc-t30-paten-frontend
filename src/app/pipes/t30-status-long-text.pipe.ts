import { Pipe, PipeTransform } from '@angular/core';

import { STATUS_LONG_TEXT } from '../const';

@Pipe({
  name: 't30StatusLongText'
})

export class T30StatusLongTextPipe implements PipeTransform {

  transform(value: number): string {
    if ((value < 0) || (value > 5)) {
      return '?';
      console.error('Unknown Status', value);
    }
    return STATUS_LONG_TEXT[value];
  }
}
