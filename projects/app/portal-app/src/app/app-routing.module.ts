import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInRedirectCallbackComponent, SignOutRedirectCallbackComponent, createDataForValidateProfilesGuard, validateProfilesGuard } from '@authorization-lib'
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AuthorizationErrorComponent } from './component/authorization-error/authorization-error.component'
import { AutoLoginComponent } from './component/auto-login/auto-login.component';



const routes: Routes = [
  { path: '', loadChildren: async () => import('@EmployeeModule').then(m => m.EmployeesModule) },
  { path: 'employees', loadChildren: async () => import('@EmployeeModule').then(m => m.EmployeesModule) },
  {
    path: 'identity',
    loadChildren: async () => import('@IdentityModule').then(m => m.IdentityModule),
    canActivate: [validateProfilesGuard],
    data: createDataForValidateProfilesGuard(v => v.Identity.HasRights)
  },
  {
    path: 'sms-service',
    loadChildren: async () => import('@SmsServiceModule').then(m => m.SmsServiceModule),
    canActivate: [validateProfilesGuard],
    data: createDataForValidateProfilesGuard(v => v.SmsService.HasRights)
  },
  {
    path: 'email-service',
    loadChildren: async () => import('@EmailServiceModule').then(m => m.EmailServiceModule),
    canActivate: [validateProfilesGuard],
    data: createDataForValidateProfilesGuard(v => v.EmailService.HasRights)
  },
  {
    path: 'articles',
    loadChildren: async () => import('@ArticlesModule').then(m => m.ArticlesModule),
    canActivate: [validateProfilesGuard],
    data: createDataForValidateProfilesGuard(v => v.IsAuthorize)
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
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
