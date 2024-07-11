import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module'
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ComponentsModule, ToastMessengerService, PrimeNGLocale, } from '@components-lib';

import { AppRootComponent } from './component/root/root.component';
import { TopBarComponent } from './component/top-bar/top-bar.component';

import { MessengerService, SharedModule, HttpErrorInterceptor, ApiService, ApiServiceBaseUrl } from '@shared-lib';
import { AuthorizationModule, IdentityServerAddress, authenticatedFeature } from '@authorization-lib';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AutoLoginComponent } from './component/auto-login/auto-login.component'

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule, BrowserAnimationsModule,
    SharedModule, AuthorizationModule, ComponentsModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(authenticatedFeature),
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    }) : []
  ],
  declarations: [AppRootComponent,  TopBarComponent, PageNotFoundComponent, AutoLoginComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: MessengerService, useClass: ToastMessengerService },
    { provide: PrimeNGLocale, useClass: PrimeNGLocale },
    {
      provide: IdentityServerAddress,
      useValue: new IdentityServerAddress(
        environment.AuthSetting.ClientRoot,
        environment.AuthSetting.IpAuthority,
        environment.AuthSetting.ClientId)
    },
    { provide: ApiServiceBaseUrl, useValue: environment.ApiUrl },
    { provide: ApiService, useClass: ApiService },

  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
