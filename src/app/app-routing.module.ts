import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './views/login/login.component';
import { AllFreeAgentsComponent } from './all-free-agents/all-free-agents.component';
import { MyFreeAgentsComponent } from './views/my-free-agents/my-free-agents.component';
import { MySalaryCapComponent } from './views/my-salary-cap/my-salary-cap.component';
import { NegotiationsComponent } from './views/negotiations/negotiations.component';


const routes: Routes = [
  {path: 'all-free-agents', component: AllFreeAgentsComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'my-free-agents', component: MyFreeAgentsComponent, canActivate: [AuthGuard]},
  { path: 'my-salary-cap', component: MySalaryCapComponent, canActivate: [AuthGuard]},
  { path: 'negociations', component: NegotiationsComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/all-free-agents' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
