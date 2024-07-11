import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService, AuthenticatedActionGroup, ProfileCollection, authenticatedFeature } from '@authorization-lib';
import { MessengerService, ObservableDestroyer } from '@shared-lib';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { MenuItem } from '@components-lib';

@Component({
  selector: 'zms-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private messengerService: MessengerService, private store$: Store) {
    this.bindingStore();
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** В процессе загрузки */
  loading = signal(false);

  /** Тестовый стенд */
  isTest = signal(environment.test);

  /** Элементы главного меню */
  menuItems = signal<MenuItem[]>([]);

  /** Элементы левого меню */
  menuRightItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.store$.select(authenticatedFeature.selectAuthenticatedState).subscribeWithDestroy({
      next: state => this.generateMenu(state.isAuthenticated, state.profile)
    }, this.destroyer$);
  }

  login = () : void => {
    this.loading.set(true);
    this.authService.login().subscribeWithDestroy({
      next: () => this.loading.set(false),
      error: (e) => {
        this.messengerService.ShowException(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  logout = () : void => {
    this.loading.set(true);
    this.authService.logout().subscribeWithDestroy({
      next: () => this.loading.set(false),
      error: (e) => {
        this.messengerService.ShowException(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  refreshToken = () : void => {
    this.loading.set(true);
    this.authService.refreshToken().subscribeWithDestroy({
      next: () => this.loading.set(false),
      error: (e) => {
        this.messengerService.ShowException(e);
        this.login();
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  /** Генерация меню */
  private generateMenu = (isUserAuthenticated: boolean, profile: ProfileCollection) : void => {
    this.generateMainMenuItems(profile);
    this.generateLeftMenuItems(isUserAuthenticated, profile);
  }

  /** Создания главного меню */
  private generateMainMenuItems = (profile: ProfileCollection) : void => {
    const menuItems: MenuItem[] = [];
    const employeeMenuItem: MenuItem = { label: 'Сотрудники', icon: 'google-symbol manage_accounts', routerLink: '/' };
    menuItems.push(employeeMenuItem);

    if (profile.Employee.HasRights) {
      employeeMenuItem.items = [];
      employeeMenuItem.routerLink = undefined;
      employeeMenuItem.items.push({ label: 'Просмотр сотрудников', icon: 'google-symbol person_search', routerLink: '/' });
      employeeMenuItem.items.push({ label: 'Управление сотрудниками', icon: 'google-symbol manage_accounts', routerLink: '/employees/manager' });
    }

    if (profile.IsAuthorize) {
      const articlesMenuItem: MenuItem = { label: 'Статьи', icon: 'google-symbol newsmode', routerLink: '/articles' };
      menuItems.push(articlesMenuItem);
    }

    menuItems.push({ label: 'ОМС', icon: 'google-symbol monitor_heart', url: `${environment.OmsAppUrl}/auto-login` });
    this.menuItems.set(menuItems);
  }

  /** Создание левого меню */
  private generateLeftMenuItems = (isUserAuthenticated: boolean, profile: ProfileCollection) : void => {
    const menuItems: MenuItem[] = [];

    if (profile.Identity.HasRights || profile.EmailService.HasRights || profile.SmsService.HasRights) {
      const adminMenuItem: MenuItem = { label: 'Администрирование', icon: 'google-symbol admin_panel_settings' };
      adminMenuItem.items = [];

      menuItems.push(adminMenuItem);
      if (profile.Identity.HasRights) {
        adminMenuItem.items.push({ label: 'Пользователи', icon: 'google-symbol badge', routerLink: '/identity' });
      }

      if (profile.EmailService.HasRights) {
        adminMenuItem.items.push({ label: 'Сервис отправки Email', icon: 'google-symbol alternate_email', routerLink: '/email-service' });
      }
      if (profile.SmsService.HasRights) {
        adminMenuItem.items.push({ label: 'Сервис отправки СМС', icon: 'google-symbol system_update', routerLink: '/sms-service' });
      }
    }

    if (isUserAuthenticated) {
      const loginMenuItem: MenuItem = { label: profile.UserName, icon: 'google-symbol person' };
      menuItems.push(loginMenuItem);
      loginMenuItem.items = [
        { label: 'Обновить профиль', icon: 'google-symbol refresh', command: () => { this.refreshToken(); } },
        { label: 'Выход', icon: 'google-symbol logout', command: () => { this.logout(); } }
      ];
    } else {
      const loginMenuItem: MenuItem = { label: 'Вход', icon: 'google-symbol person', command: () => { this.login(); } };
      menuItems.push(loginMenuItem);
    }

    this.menuRightItems.set(menuItems);
  }

  /** Привязка хранилища к сервису авторизации */
  private bindingStore = () : void => {
    this.authService.loginChanged$.subscribeWithDestroy({
      next: isAuthenticated => {
        this.authService.getProfiles().subscribeWithDestroy({
          next: profile => {
            this.store$.dispatch(AuthenticatedActionGroup.authChange({
              isAuthenticated: isAuthenticated,
              profile: profile
            }))
          }
        }, this.destroyer$)
      }
    }, this.destroyer$);

    this.authService.isAuthenticated().subscribeWithDestroy({
      error: (e) => { this.messengerService.ShowException(e); }
    }, this.destroyer$);
  }
}
