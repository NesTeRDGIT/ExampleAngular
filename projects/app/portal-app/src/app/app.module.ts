import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module'
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRootComponent } from './component/root/root.component';
import { TopBarComponent } from './component/top-bar/top-bar.component';

import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api';
import {TieredMenuModule } from 'primeng/tieredmenu'

import { MessengerService, SharedModule, HttpErrorInterceptor, ApiService, PrimeMessengerService, PrimeNGLocale, ApiServiceBaseUrl } from '@shared-lib';
import { AuthorizationModule, IdentityServerAddress } from '@authorization-lib'

import { PanelMenuModule } from 'primeng/panelmenu';


import { SidebarModule } from 'primeng/sidebar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AutoLoginComponent } from './component/auto-login/auto-login.component'

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule, BrowserAnimationsModule,
    SharedModule, AuthorizationModule,
    SidebarModule, MenubarModule,  TabViewModule, ToastModule, TieredMenuModule,PanelMenuModule
  ],
  declarations: [AppRootComponent,  TopBarComponent, PageNotFoundComponent, AutoLoginComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: MessageService, useClass: MessageService },
    { provide: MessengerService, useClass: PrimeMessengerService },
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
