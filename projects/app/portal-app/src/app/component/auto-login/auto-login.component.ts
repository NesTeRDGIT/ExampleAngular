import { Router } from '@angular/router';
import { MessengerService, ObservableDestroyer } from '@shared-lib';
import { AuthService } from '@authorization-lib';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'zms-auto-login',
  templateUrl: './auto-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoLoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private messengerService: MessengerService, private router: Router) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribeWithDestroy({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          this.authService.login().subscribeWithDestroy({
            error: (e) => { this.messengerService.ShowException(e); }
          }, this.destroyer$);
        } else {
          this.router.navigateByUrl(``);
        }
      }
    }, this.destroyer$)

  }
}
