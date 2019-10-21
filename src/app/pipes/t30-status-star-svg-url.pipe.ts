import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FARBCODE } from '../const';

@Pipe({
  name: 't30StatusStarSvgUrl'
})
export class T30StatusStarSvgUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: number) {
    if ((value < 0) || (value > 5)) {
      value = 0;
      console.error('Unknown Status', value);
    }
    const farbe = FARBCODE[value];
    const starSvg = '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="star rating" data-rating="1">' +
      '<polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill:' +
      farbe + ';"/>' +
      '</svg>';
    const myUrl = 'data:image/svg+xml;base64,' + window.btoa(starSvg);
    return this.sanitizer.bypassSecurityTrustResourceUrl(myUrl);
  }
}
