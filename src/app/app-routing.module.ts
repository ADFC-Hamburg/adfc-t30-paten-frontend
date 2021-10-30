import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangeTokenComponent } from './password-change-token/password-change-token.component';
import { AbmeldenAskComponent } from './abmelden-ask/abmelden-ask.component';
import { TokenEingebenComponent } from './token-eingeben/token-eingeben.component';
import { EmailVersandComponent } from './email-versand/email-versand.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { EmptyComponent } from './empty/empty.component';
import { SozialeEinrichtungsListeComponent } from './soziale-einrichtungs-liste/soziale-einrichtungs-liste.component';
import { ProfileComponent } from './profile/profile.component';
import { SozialeEinrichtungViewComponent } from './soziale-einrichtung-view/soziale-einrichtung-view.component';
import { SozialeEinrichtungEditComponent } from './soziale-einrichtung-edit/soziale-einrichtung-edit.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { ForderungEditComponent } from './forderung-edit/forderung-edit.component';
import { ForderungViewComponent } from './forderung-view/forderung-view.component';
import { SpendenComponent } from './spenden/spenden.component';

const routes: Routes = [{
  path: 'main',
  component: MainComponent,
  canActivate: [AuthGuard],
}, {
  path: 'einrichtung/edit/:id',
  component: SozialeEinrichtungEditComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard],
}, {
  path: 'forderung/edit/:id',
  component: ForderungEditComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard],
}, {
  path: 'forderung/view/:id',
  component: ForderungViewComponent,
}, {
  path: 'einrichtung/view/:id',
  component: SozialeEinrichtungViewComponent,
}, {
  path: 'token/:email/:token',
  component: TokenEingebenComponent,
}, {
  path: 'passwordChangeToken/:token',
  component: PasswordChangeTokenComponent,
}, {
  path: 'mailSend',
  component: EmailVersandComponent,
  canActivate: [AuthGuard],
}, {
  path: 'sozEinrKarte',
  component: EmptyComponent,
}, {
  path: 'sozEinrListe',
  component: SozialeEinrichtungsListeComponent,
}, {
  path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthGuard],
  canDeactivate: [CanDeactivateGuard],
}, {
  path: 'AbmeldenAsk',
  component: AbmeldenAskComponent,
  canActivate: [AuthGuard],
}, {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'spenden',
  component: SpendenComponent,
}, {
  path: 'register',
  component: RegisterComponent
}, {
  // otherwise redirect to home
  path: '**',
  redirectTo: 'sozEinrKarte'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],

})
export class AppRoutingModule { }
