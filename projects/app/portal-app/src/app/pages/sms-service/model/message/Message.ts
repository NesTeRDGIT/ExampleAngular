import { ArgumentNullException, CheckPropertyService } from '@shared-lib';
import { Status } from './Status';
import { TimeInterval } from './TimeInterval';
import { Category } from './Category';
import { Recipient } from './Recipient';

/** Сообщение */
export class Message {

  /** Идентификатор */
  Id = 0;

  /** Дата создания */
  CreatedDate = new Date();

  /** Имя отправителя */
  SenderName = "";

  /** Статус */
  Status = new Status();

  /** Провайдер */
  Provider = "";

  /** Категория */
  Category = new Category();

  /** Текст сообщения */
  Text = "";

  /** Период отправки сообщения */
  SendingPeriod = new TimeInterval();

  /** Дата обработки */
  ProcessedDate: Date | null = null;

  /** Количество потраченных СМС */
  SmsCount = 0;

  /** Внешний идентификатор */
  ExternalId = "";

  /** Дата отправки СМС */
  SendingDate: Date | null = null;

  /** Комментарий */
  Comment = "";

  /** Получатель */
  Recipient = new Recipient();

  static Create(source: any): Message {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Message();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Id = Number(source.Id);
    dest.CreatedDate = new Date(source.CreatedDate);
    dest.SenderName = String(source.SenderName);
    dest.Status = Status.Create(source.Status);
    dest.Category = Category.Create(source.Category);
    dest.Text = String(source.Text);
    dest.SendingPeriod = TimeInterval.Create(source.SendingPeriod);
    dest.ProcessedDate = source.ProcessedDate == null ? null : new Date(source.ProcessedDate);
    dest.SendingDate = source.SendingDate == null ? null : new Date(source.SendingDate);
    dest.SmsCount = Number(source.SmsCount);
    dest.ExternalId = String(source.ExternalId);
    dest.Comment = String(source.Comment);
    dest.Recipient = Recipient.Create(source.Recipient);
    dest.Provider = String(source.Provider);
    return dest;
  }
}
