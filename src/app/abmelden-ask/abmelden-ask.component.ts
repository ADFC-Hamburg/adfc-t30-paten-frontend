import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-abmelden-ask',
  templateUrl: './abmelden-ask.component.html',
  styleUrls: ['./abmelden-ask.component.css']
})
export class AbmeldenAskComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
  }
  logout() {
    this.authenticationService.logout();
  }
}
