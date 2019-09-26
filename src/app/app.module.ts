import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YagaModule } from '@yaga/leaflet-ng2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenEingebenComponent } from './token-eingeben/token-eingeben.component';
import { EmailVersandComponent } from './email-versand/email-versand.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandleService } from './services/error-handle.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AbmeldenAskComponent } from './abmelden-ask/abmelden-ask.component';
import { SozialeEinrichtungsKarteComponent } from './soziale-einrichtungs-karte/soziale-einrichtungs-karte.component';
import { SozialeEinrichtungsListeComponent } from './soziale-einrichtungs-liste/soziale-einrichtungs-liste.component';
import { ProfileComponent } from './profile/profile.component';
import { getGermanPaginatorIntl } from './german-paginator-intl';
import { SafePipe } from './safe.pipe';
import { SozEinrButtonsComponent } from './soz-einr-buttons/soz-einr-buttons.component';
import { T30StatusLongTextPipe } from './pipes/t30-status-long-text.pipe';
import { T30StatusShortTextPipe } from './pipes/t30-status-short-text.pipe';
import { T30StatusStarSvgUrlPipe } from './pipes/t30-status-star-svg-url.pipe';
import { SozialeEinrichtungViewComponent } from './soziale-einrichtung-view/soziale-einrichtung-view.component';
import { SozialeEinrichtungEditComponent } from './soziale-einrichtung-edit/soziale-einrichtung-edit.component';
import { ForderungEditComponent } from './forderung-edit/forderung-edit.component';
import { PasswordChangeTokenComponent } from './password-change-token/password-change-token.component';
import { EinrichtungsartPipe } from './pipes/einrichtungsart.pipe';
import { SpurigkeitPipe } from './pipes/spurigkeit.pipe';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    TokenEingebenComponent,
    EmailVersandComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    AbmeldenAskComponent,
    SozialeEinrichtungsKarteComponent,
    SozialeEinrichtungsListeComponent,
    ProfileComponent,
    SafePipe,
    SozEinrButtonsComponent,
    T30StatusLongTextPipe,
    T30StatusShortTextPipe,
    T30StatusStarSvgUrlPipe,
    SozialeEinrichtungViewComponent,
    SozialeEinrichtungEditComponent,
    ForderungEditComponent,
    PasswordChangeTokenComponent,
    EinrichtungsartPipe,
    SpurigkeitPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatRadioModule,
    MatTableModule,
    MatTabsModule,
    YagaModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        headerName: 'Access-Control-Allow-Credentials',
        whitelistedDomains: ['tools.adfc-hamburg.de'],
      }
    }),
    MatTooltipModule,
  ],
  providers: [
    ErrorHandleService,
    { provide: ErrorHandler, useClass: ErrorHandleService },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MatPaginatorIntl, useValue: getGermanPaginatorIntl() }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
