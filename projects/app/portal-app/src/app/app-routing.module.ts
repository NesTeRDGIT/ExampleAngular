import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuardService, ProfileConstant, SignInRedirectCallbackComponent, SignOutRedirectCallbackComponent } from '@authorization-lib'
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AuthorizationErrorComponent } from './component/authorization-error/authorization-error.component'
import { AutoLoginComponent } from './component/auto-login/auto-login.component';



const routes: Routes = [
  { path: '', loadChildren: () => import('@EmployeeModule').then(m => m.EmployeesModule)},
  { path: 'employees',  loadChildren: () => import('@EmployeeModule').then(m => m.EmployeesModule) },
  {
    path: 'identity',
    loadChildren: () => import('@IdentityModule').then(m => m.IdentityModule),
    canActivate: [AuthGuardService],
    data: { profile: ProfileConstant.Identity }
  },
  {
    path: 'sms-service',
    loadChildren: () => import('@SmsServiceModule').then(m => m.SmsServiceModule),
    canActivate: [AuthGuardService],
    data: { profile: ProfileConstant.Appealing }
  },
  {
    path: 'email-service',
    loadChildren: () => import('@EmailServiceModule').then(m => m.EmailServiceModule),
    canActivate: [AuthGuardService],
    data: { profile: ProfileConstant.Appealing }
  },

  { path: 'auto-login', component: AutoLoginComponent },
  { path: 'signin-callback', component: SignInRedirectCallbackComponent },
  { path: 'signout-callback', component: SignOutRedirectCallbackComponent },
  { path: 'authorization-error', component: AuthorizationErrorComponent },
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes,  { bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
