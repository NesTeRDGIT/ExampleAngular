import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClientRedirectUriService } from '@authorization-lib';

@Component({
  selector: 'zms-authorization-error',
  templateUrl: './authorization-error.component.html',
  styleUrls: ['./authorization-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationErrorComponent implements OnDestroy {

  constructor(private clientRedirectUriService: ClientRedirectUriService, private router: Router) { }

  onNavigateMainPage = () : void => {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.clientRedirectUriService.clear();
  }
}
