import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Message, MessageService, ConfirmMessage, PrimeNGLocale } from '@components-lib';

@Component({
  selector: 'zms-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppRootComponent {
  constructor(
    primeNGLocale: PrimeNGLocale,
    private messageService: MessageService) {
    primeNGLocale.SetRuLocale();
  }

  onReject(message: Message) : void {
    this.messageService.clear('confirm');
    const confirmMessage = message as ConfirmMessage;
    if (confirmMessage) {
      confirmMessage.subject.next(false);
      confirmMessage.subject.complete();
    }
  }

  onConfirm(message: Message) : void {
    this.messageService.clear('confirm');
    const confirmMessage = message as ConfirmMessage;
    if (confirmMessage) {
      confirmMessage.subject.next(true);
      confirmMessage.subject.complete();
    }
  }
}
