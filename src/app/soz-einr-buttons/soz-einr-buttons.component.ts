import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-soz-einr-buttons',
  templateUrl: './soz-einr-buttons.component.html',
  styleUrls: ['./soz-einr-buttons.component.css']
})
export class SozEinrButtonsComponent {

  @Input() public id;
  @Input() public tempo30;
  @Input() public show_view = 1;

}
