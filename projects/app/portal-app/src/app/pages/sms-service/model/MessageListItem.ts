

import { ArgumentNullException, CheckPropertyService } from '@shared-lib';

/** Сообщение */
export class MessageListItem {

  /** Идентификатор */
  Id = 0;

  /** Дата создания */
  CreatedDate: Date = new Date();

  /** Код статуса */
  StatusValue = "";

  /** Наименование статуса */
  StatusName = "";

  /** Код категории */
  CategoryValue = "";

  /** Наименование категории */
  CategoryName = "";

  /** Текст СМС */
  Text = "";

  /** Дата обработки */
  ProcessedDate: Date | null = null;

  /** Комментарий */
  Comment = "";

  /** Внешний идентификатор */
  ExternalId = "";

  /** Количество затраченных СМС */
  SmsCount = 0;

  /** Дата отправки */
  SendingDate: Date | null = null;

  /** Временной период отправки сообщения */
  SendingPeriod = "";

  /** Номер телефона */
  Phone = "";


  static Create(source: any): MessageListItem {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new MessageListItem();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Id = Number(source.Id);
    dest.CreatedDate = new Date(source.CreatedDate);
    dest.StatusValue = String(source.StatusValue);
    dest.StatusName = String(source.StatusName);
    dest.ProcessedDate = source.ProcessedDate == null ? null : new Date(source.ProcessedDate);
    dest.Comment = String(source.Comment);
    dest.Text = String(source.Text);
    dest.ExternalId = String(source.ExternalId);
    dest.CategoryValue = String(source.CategoryValue);
    dest.CategoryName = String(source.CategoryName);
    dest.SmsCount = Number(source.SmsCount);
    dest.SendingDate = source.SendingDate == null ? null : new Date(source.SendingDate);
    dest.SendingPeriod = String(source.SendingPeriod);
    dest.Phone = String(source.Phone);
    return dest;
  }
}
