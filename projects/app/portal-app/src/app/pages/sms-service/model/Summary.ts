import { ArgumentNullException, CheckPropertyService } from '@shared-lib';

/** Краткая информация о сообщениях */
export class Summary {

  /** Всего сообщений */
  TotalMessage = 0;

  /** Всего СМС */
  TotalSms = 0;

  /** Новых сообщений */
  NewMessage = 0;

  /** Новых СМС */
  NewSms = 0;

  /** В обработке сообщений */
  InProcessingMessage = 0;

  /** В обработке СМС */
  InProcessingSms = 0;

  /** Отправлено сообщений */
  SentMessage = 0;

  /** Отправлено СМС */
  SentSms = 0;

  /** Ошибки отправки сообщений */
  ErrorMessage = 0;

  /** Ошибки отправки СМС */
  ErrorSms = 0;


  static Create(source: any): Summary {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Summary();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.TotalMessage = Number(source.TotalMessage);
    dest.TotalSms = Number(source.TotalSms);
    dest.NewMessage = Number(source.NewMessage);
    dest.NewSms = Number(source.NewSms);
    dest.InProcessingMessage = Number(source.InProcessingMessage);
    dest.InProcessingSms = Number(source.InProcessingSms);
    dest.SentMessage = Number(source.SentMessage);
    dest.SentSms = Number(source.SentSms);
    dest.ErrorMessage = Number(source.ErrorMessage);
    dest.ErrorSms = Number(source.ErrorSms);
    return dest;
  }
}
