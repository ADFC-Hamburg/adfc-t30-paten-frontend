import { Component, Input, Output, EventEmitter } from '@angular/core';

import { LEGENDE_TEXT } from '../const';

@Component({
  selector: 'app-star-legende',
  templateUrl: './star-legende.component.html',
  styleUrls: ['./star-legende.component.css']
})
export class StarLegendeComponent {
  LEGENDE_TEXT = LEGENDE_TEXT;
  showLegendeVal = false;

  @Input()
  get showLegende() {
    return this.showLegendeVal;
  }

  @Output() showLegendeChange = new EventEmitter();

  set showLegende(val) {
    this.showLegendeVal = val;
    this.showLegendeChange.emit(this.showLegendeVal);
  }

}
