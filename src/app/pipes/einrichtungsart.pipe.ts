import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'einrichtungsart'
})
export class EinrichtungsartPipe implements PipeTransform {
  ART_STR = [
    'Unklar',
    'Kindertagesstätte / Kindergaten',
    'Schule',
    'Alten-, Pflege- und Tagespflegeheim',
    'Krankenhaus',
  ];

  transform(value: number): String {
    return this.ART_STR[value];
  }

}
