import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { AllFreeAgentsComponent } from './all-free-agents/all-free-agents.component';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from "ngx-spinner";
import { LoginComponent } from './views/login/login.component';
import { MyFreeAgentsComponent } from './views/my-free-agents/my-free-agents.component';
import { MySalaryCapComponent } from './views/my-salary-cap/my-salary-cap.component';
import { NegotiationsComponent } from './views/negotiations/negotiations.component';

/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { HttpInterceptorProviders} from './interceptors/interceptor-provider';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    AllFreeAgentsComponent,
    LoginComponent,
    MyFreeAgentsComponent,
    MySalaryCapComponent,
    NegotiationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
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
    // Amplify
    AmplifyUIAngularModule,
    NgxSpinnerModule
  ],
  providers: [
    AmplifyService,
    AuthGuard,
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
