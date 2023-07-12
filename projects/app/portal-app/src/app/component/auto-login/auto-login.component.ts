import { Router } from '@angular/router';
import { MessengerService } from '@shared-lib';
import { AuthService } from '@authorization-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zms-auto-login',
  templateUrl: './auto-login.component.html'
})
export class AutoLoginComponent implements OnInit {

  constructor(private authService: AuthService, private messengerService: MessengerService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          this.authService.login().subscribe({
            error: (e) => { this.messengerService.ShowException(e); }
          });
        } else {
          this.router.navigateByUrl(``);
        }
      }
    })

  }
}
