import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessengerService, ProblemDetailApsNet } from '@shared-lib';
import { MessageRepository } from '@SmsServiceModuleRoot/services/repository/message.repository';
import { Message } from '@SmsServiceModuleRoot/model/message/Message';

@Component({
  selector: 'zms-message-viewer',
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss']
})
export class MessageViewerComponent {
  constructor(
    private messengerService: MessengerService,
    private messageRepository: MessageRepository
  ) {
  }


  _messageId = 0;
  /** Идентификатор сообщения */
  @Input() set MessageId(value: number) {
    this._messageId = value;
    this.load();
  }

  get MessageId(): number {
    return this._messageId;
  }

  /** Модель */
  model = new Message();

  /** Событие закрытия */
  @Output() close = new EventEmitter<void>();

  /** В процессе загрузке */
  loading = false;

  /** Обработчик команды закрытия окна */
  onCloseClick = () => {
    this.close.emit();
  }

  /**Загрузка пакета */
  private load = async () => {
    if (this.MessageId !== 0) {
      this.loading = true;

      this.messageRepository.get(this.MessageId).subscribe({
        next: result => {
          this.model = result;
          this.loading = false;
        },
        error: (e: ProblemDetailApsNet) => { this.messengerService.ShowException(e); this.loading = false; }
      });
    }
  }
}
