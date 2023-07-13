import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuardService, ProfileConstant, SignInRedirectCallbackComponent, SignOutRedirectCallbackComponent } from '@authorization-lib'
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AuthorizationErrorComponent } from './component/authorization-error/authorization-error.component'
import { AutoLoginComponent } from './component/auto-login/auto-login.component';



const routes: Routes = [
  {
    path: 'sms-service',
    loadChildren: () => import('@SmsServiceModule').then(m => m.SmsServiceModule),
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
