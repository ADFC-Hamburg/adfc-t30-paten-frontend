import { Pipe, PipeTransform } from '@angular/core';
import { SPURIGKEIT_STR } from '../const';

@Pipe({
  name: 'spurigkeit'
})

export class SpurigkeitPipe implements PipeTransform {

  transform(value: number): string {
    return SPURIGKEIT_STR[value];
  }

}
