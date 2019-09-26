import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busverkehr'
})
export class BusverkehrPipe implements PipeTransform {
  BUSVERKEHR = [
    'Unklar',
    'Kein Busverkehr',
    'weniger als 6 mal/h',
    '6 mal/h oder mehr'
  ];
  transform(idx: number): string {
    return this.BUSVERKEHR[idx];
  }

}
