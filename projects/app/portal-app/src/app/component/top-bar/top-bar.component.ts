import { Component, OnInit } from '@angular/core';
import { AuthService, ProfileCollection } from '@authorization-lib';
import { MessengerService } from '@shared-lib';
import { MenuItem } from 'primeng/api';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'zms-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  loading = false;
  isUserAuthenticated = false;
  isTest = environment.test;


  constructor(private authService: AuthService, private messengerService: MessengerService) {
  }

  /** Элементы главного меню */
  menuItems: MenuItem[] = [];

  /** Элементы левого меню */
  menuRightItems: MenuItem[] = [];

  ngOnInit(): void {
    this.authService.loginChanged.subscribe(res => {
      this.isUserAuthenticated = res;
      this.checkRoles();
    });
    this.authService.isAuthenticated().subscribe({
      error: (e) => { this.messengerService.ShowException(e); }
    });
    this.generateMenu();
  }

  login = () => {
    this.loading = true;
    this.authService.login().subscribe({
      next: () => { this.loading = false },
      error: (e) => { this.messengerService.ShowException(e); this.loading = false; }
    });
  }

  logout = () => {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => { this.loading = false },
      error: (e) => { this.messengerService.ShowException(e); this.loading = false; }
    });
  }

  refreshToken = () => {
    this.loading = true;
    this.authService.refreshToken().subscribe({
      next: () => { this.loading = false },
      error: (e) => { this.messengerService.ShowException(e); this.login(); this.loading = false; }
    });
  }

  /** Генерация меню */
  private generateMenu = () => {
    this.generateMainMenuItems();
    this.generateLeftMenuItems();
  }

  /** Создания главного меню */
  private generateMainMenuItems = () => {
    this.menuItems = [];
    const employeeMenuItem: MenuItem = { label: 'Сотрудники', icon: 'google-symbol manage_accounts', routerLink: '/' };
    this.menuItems.push(employeeMenuItem);


    if (this.profiles?.Employee.Admin) {
      employeeMenuItem.items = [];
      employeeMenuItem.routerLink = null;
      employeeMenuItem.items.push({ label: 'Просмотр сотрудников', icon: 'google-symbol person_search', routerLink: '/' });
      employeeMenuItem.items.push({ label: 'Управление сотрудниками', icon: 'google-symbol manage_accounts', routerLink: '/employees/manager' });
    }

    this.menuItems.push({ label: 'ОМС', icon: 'google-symbol monitor_heart', url: `${environment.OmsAppUrl}/auto-login` });
  }

  /** Создание левого меню */
  private generateLeftMenuItems = () => {
    this.menuRightItems = [];
      const adminMenuItem: MenuItem = { label: 'Администрирование', icon: 'google-symbol admin_panel_settings' };
      adminMenuItem.items = [];

      if (this.profiles?.SmsService.HasRights) {
        adminMenuItem.items.push({ label: 'Сервис отправки СМС', icon: 'google-symbol system_update', routerLink: '/sms-service' });
      }
  }

  /** Коллекция профилей  */
  profiles: ProfileCollection | null = null;

  /** Имя пользователя */
  userName = '';

  /** Проверка прав */
  private checkRoles = () => {
    this.authService.getProfiles().subscribe({
      next: profiles => {
        this.userName = profiles.UserName;
        this.profiles = profiles;
        this.generateMenu();
      }
    });
  }
}
