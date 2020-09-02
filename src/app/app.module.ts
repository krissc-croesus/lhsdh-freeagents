import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list'
import { AllFreeAgentsComponent } from './all-free-agents/all-free-agents.component';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';


import { LoginComponent } from './views/login/login.component';
import { MyFreeAgentsComponent } from './views/my-free-agents/my-free-agents.component';
import { MySalaryCapComponent } from './views/my-salary-cap/my-salary-cap.component';
import { NegotiationsComponent } from './views/negotiations/negotiations.component';
import { PlayerDetailComponent } from './widgets/player-detail/player-detail.component';

/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { HttpInterceptorProviders} from './interceptors/interceptor-provider';
import { AuthGuard } from './auth.guard';

// Locales
import { registerLocaleData } from '@angular/common';
import localeFr from "@angular/common/locales/fr";
import { TablePlayerDetailComponent } from './widgets/table-player-detail/table-player-detail.component';
import { OfferSenderComponent } from './widgets/offer-sender/offer-sender.component';
import { NegoPlayerDetailComponent } from './widgets/nego-player-detail/nego-player-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AllFreeAgentsComponent,
    LoginComponent,
    MyFreeAgentsComponent,
    MySalaryCapComponent,
    NegotiationsComponent,
    PlayerDetailComponent,
    TablePlayerDetailComponent,
    OfferSenderComponent,
    NegoPlayerDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //MAT
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSelectModule,
    // Amplify
    AmplifyUIAngularModule
  ],
  providers: [
    AmplifyService,
    AuthGuard,
    HttpInterceptorProviders,
    { provide: LOCALE_ID, useValue: "fr-ca" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeFr, "fr");
