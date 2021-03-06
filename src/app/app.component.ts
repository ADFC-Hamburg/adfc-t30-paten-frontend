import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from './services/notifier.service';
import { AuthenticationService } from './services/authentication.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AppSnackBarComponent } from './app-snack-bar/app-snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Tempo 30 an sozialen Einrichtungen';
  navLinks = [
    {
      path: '/sozEinrKarte', label: 'Karte der Einrichtungen',
      icon: 'map', showPublic: true, showUser: true
    },
    {
      path: '/sozEinrListe', label: 'Liste der Einrichtungen',
      icon: 'list', showPublic: true, showUser: true
    },
    {
      path: '/main', label: 'Meine Forderungsmails', icon: 'visibility',
      showPublic: false, showUser: true
    },
    {
      path: '/profile', label: 'Mein Profil', icon: 'account_circle',
      showPublic: false, showUser: true
    },
    {
      path: '/spenden', label: 'Spenden', icon: 'directions_bike',
      showPublic: true, showUser: true
    },
    {
      path: '/AbmeldenAsk', label: 'Abmelden', icon: 'power_settings_new',
      showPublic: false, showUser: true
    },
    {
      path: '/login', label: 'Anmelden', icon: 'send', showPublic: true,
      showUser: false
    },
    {
      path: '/register', label: 'Registrieren', icon: 'person_add', showPublic: true,
      showUser: false
    }
  ];
  public version: string = environment.VERSION;
  public CAMPAIN_URL = environment.CAMPAIN_URL;
  CONTACT_MAIL = environment.CONTACT_MAIL;
  public API_VERSION = 'unklar';
  sub: any;
  myNavLinks = [];
  myRoute = null;
  showHint = true;
  logoutInSeconds = -1;
  logoutWarnTime = 600;
  logoutHintSub: Subscription = null;
  snackBarRef = null;
  constructor(
    private snackBar: MatSnackBar,
    private notifierService: NotifierService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.API_VERSION = environment.API_BASE_URL
      .replace(/^.*ersion(.*)\/api.*$/, '$1');
    this.sub = this.notifierService.messages.subscribe(e => {
      if (e.isClear()) {
        if (this.snackBarRef != null) {
          this.snackBarRef.dismiss();
        }
      } else {
        const config = {
          data: e,
          duration: e.duration,
        };
        this.snackBarRef = this.snackBar.openFromComponent(AppSnackBarComponent, config);
      }
    });
    this.router.events.subscribe(event => {
      this.calcNavLinks();
    });
    this.logoutHintSub = interval(1000).subscribe(val => this.calcLogoutHint());
    this.calcLogoutHint();
  }
  calcLogoutHint() {
    this.logoutInSeconds = this.authenticationService.calcLogInTime();
  }
  extendLoginTime() {
    this.authenticationService.extendLoginTime().subscribe(val => {
    });
  }
  showLink(link) {
    if (this.authenticationService.isLoggedIn()) {
      return link.showUser;
    } else {
      return link.showPublic;
    }
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
            extra: true,
            showUser: true,
            showPublic: true,
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
    this.logoutHintSub.unsubscribe();
  }
}
