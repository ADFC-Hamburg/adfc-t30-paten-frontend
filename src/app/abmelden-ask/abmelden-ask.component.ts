import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-abmelden-ask',
  templateUrl: './abmelden-ask.component.html',
  styleUrls: ['./abmelden-ask.component.css']
})
export class AbmeldenAskComponent {

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  logout() {
    this.authenticationService.logout();
  }
}
