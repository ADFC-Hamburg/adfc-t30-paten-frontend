import { Pipe, PipeTransform } from '@angular/core';

import { BUSVERKEHR } from '../const';

@Pipe({
  name: 'busverkehr'
})
export class BusverkehrPipe implements PipeTransform {

  transform(idx: number): string {
    return BUSVERKEHR[idx];
  }

}
