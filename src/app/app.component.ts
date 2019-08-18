import { Component, OnInit, OnDestroy} from '@angular/core';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorNotifierService } from './error-notifier.service';
import { AuthenticationService } from './authentication.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ADFC Tempo 30 vor sozialen Einrichtungen';
   navLinks = [
    { path: '/main', label: 'Meine T30 Eingaben', icon: 'visibility'},
    { path: '/sozEinrListe', label: 'Liste der sozialen Einrichungen', icon: 'list' },
    { path: '/sozEinrKarte', label: 'Karte der sozialen Einrichungen' , icon: 'map' },
    { path: '/profile', label: 'Mein Profil' , icon: 'account_circle' },
    { path: '/AbmeldenAsk', label: 'Abmelden', icon: 'power_settings_new' },
  ];
  public version: string = environment.VERSION;
  sub: any;
  myNavLinks = [];
  myRoute = null;
  showHint = true;
  constructor(
    private snackBar: MatSnackBar,
    private errorService: ErrorNotifierService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.sub = this.errorService.messages.subscribe(e => {
      console.log('Fehler empfangen:', e);
      this.snackBar.open(e, 'Okay');
    });
    this.router.events.subscribe(event => {
      this.calcNavLinks();
    });
  }
  calcNavLinks() {
    const p = this.location.path();
    if (this.myRoute !== p) {
      this.myRoute = p;
      this.myNavLinks = [];
      let found = false;
      for (const link of this.navLinks) {
        this.myNavLinks.push(link);
        if (link.path === p) {
          found = true;
        }
      }
      if (!found) {
        console.log(p);
        if (p.startsWith('/patenschaft/')) {
          this.myNavLinks.push({
            path: p,
            label: 'Patenschaft...',
            icon: 'edit',
            extra: true
          });
        } else {
          this.myNavLinks.push({
            path: p,
            label: '..',
            icon: 'edit',
            extra: true
          });
        }
      }
    }
  }
  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}