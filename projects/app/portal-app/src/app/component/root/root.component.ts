import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { ConfirmMessage, PrimeNGLocale } from '@shared-lib';

@Component({
  selector: 'zms-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class AppRootComponent {
  constructor(
    primeNGLocale: PrimeNGLocale,
    private messageService: MessageService) {
    primeNGLocale.SetRuLocale();
  }

  onReject(message: Message) {
    this.messageService.clear('confirm');
    const confirmMessage = message as ConfirmMessage;
    if (confirmMessage) {
      confirmMessage.subject.next(false);
      confirmMessage.subject.complete();
    }
  }

  onConfirm(message: Message) {
    this.messageService.clear('confirm');
    const confirmMessage = message as ConfirmMessage;
    if (confirmMessage) {
      confirmMessage.subject.next(true);
      confirmMessage.subject.complete();
    }
  }
}
