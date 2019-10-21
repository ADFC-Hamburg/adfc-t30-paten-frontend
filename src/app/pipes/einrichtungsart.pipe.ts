import { Pipe, PipeTransform } from '@angular/core';

import { EINRICHTUNGSART } from '../const';

@Pipe({
  name: 'einrichtungsart'
})

export class EinrichtungsartPipe implements PipeTransform {

  transform(value: number): String {
    return EINRICHTUNGSART[value];
  }

}
