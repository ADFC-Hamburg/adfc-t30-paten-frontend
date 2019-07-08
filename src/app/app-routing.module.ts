import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbmeldenAskComponent } from './abmelden-ask/abmelden-ask.component';
import { TokenEingebenComponent } from './token-eingeben/token-eingeben.component';
import { TokenBestaetigungComponent } from './token-bestaetigung/token-bestaetigung.component';
import { EmailVersandComponent } from './email-versand/email-versand.component';
import { T30patenComponent } from './t30paten/t30paten.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { SozialeEinrichtungsKarteComponent } from './soziale-einrichtungs-karte/soziale-einrichtungs-karte.component';
import { SozialeEinrichtungsListeComponent } from './soziale-einrichtungs-liste/soziale-einrichtungs-liste.component';
import { ProfileComponent } from './profile/profile.component';
import { SozialeEinrichtungViewComponent } from './soziale-einrichtung-view/soziale-einrichtung-view.component';
import { SozialeEinrichtungEditComponent } from './soziale-einrichtung-edit/soziale-einrichtung-edit.component';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [{
  path: 'main',
  component: MainComponent,
  canActivate: [AuthGuard],
}, {
  path: 'patenschaft/:id',
  component: T30patenComponent,
  canActivate: [AuthGuard],
}, {
  path: 'einrichtung/edit/:id',
  component: SozialeEinrichtungEditComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard],
}, {
  path: 'einrichtung/view/:id',
  component: SozialeEinrichtungViewComponent,
}, {
  path: 'token/:fehler',
  component: TokenEingebenComponent,
}, {
  path: 'submitToken/:token',
  component: TokenBestaetigungComponent,
}, {
  path: 'mailSend',
  component: EmailVersandComponent,
  canActivate: [AuthGuard],
}, {
  path: 'sozEinrKarte',
  component: SozialeEinrichtungsKarteComponent,
  canActivate: [AuthGuard],
}, {
  path: 'sozEinrListe',
  component: SozialeEinrichtungsListeComponent,
  canActivate: [AuthGuard],
}, {
  path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard],
}, {
  path: 'AbmeldenAsk',
  component: AbmeldenAskComponent,
  canActivate: [AuthGuard],
},  {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'register',
  component: RegisterComponent
}, {
  // otherwise redirect to home
  path: '**',
  redirectTo: 'main'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
