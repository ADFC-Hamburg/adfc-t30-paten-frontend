import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorNotifierService } from './services/error-notifier.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { ForderungService } from './services/forderung.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ADFC Tempo 30 vor sozialen Einrichtungen';
  navLinks = [
    {
      path: '/sozEinrKarte', label: 'Karte der Einrichungen',
      icon: 'map', showPublic: true, showUser: true
    },
    {
      path: '/sozEinrListe', label: 'Liste der Einrichungen',
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
  forderungList = [];
  logoutInSeconds = -1;
  logoutWarnTime = 600;
  logoutHintSub: Subscription = null;
  constructor(
    private snackBar: MatSnackBar,
    private errorService: ErrorNotifierService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private router: Router,
    private userService: UserService,
    private forderungService: ForderungService,
  ) {
  }
  ngOnInit() {
    this.API_VERSION = environment.API_BASE_URL
      .replace(/^.*ersion(.*)\/api.*$/, '$1');
    this.sub = this.errorService.messages.subscribe(e => {
      console.log('Fehler empfangen:', e);
      this.snackBar.open(e, 'Okay');
    });
    this.router.events.subscribe(event => {
      this.calcNavLinks();
    });
    this.calcForderungList();
    this.logoutHintSub = interval(1000).subscribe(val => this.calcLogoutHint());
    this.calcLogoutHint();
  }
  calcLogoutHint() {
    this.logoutInSeconds = this.authenticationService.calcLogInTime();
  }
  extendLoginTime() {
    this.authenticationService.extendLoginTime().subscribe(val => {
      console.log(val);
    });
  }
  calcForderungList() {
    if (this.authenticationService.isLoggedIn()) {
      this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
        this.forderungService.list(user.id).subscribe(data => {
          this.forderungList = data;
        });
      });
    }
  }
  showLink(link) {
    if (this.authenticationService.isLoggedIn()) {
      if (link.path === '/main') {
        if (localStorage.getItem('recalc_main_link')) {
          localStorage.removeItem('recalc_main_link');
          this.calcForderungList();
        }
        return (this.forderungList.length > 0);
      }
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
