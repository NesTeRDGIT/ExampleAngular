

import { ArgumentNullException, CheckPropertyService } from '@shared-lib';

/** Получатель */
export class Recipient {

  /** Номер телефона */
  Phone = "";

  /** Имя получателя */
  Name = "";

  static Create(source: any): Recipient {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Recipient();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Phone = String(source.Phone);
    dest.Name = String(source.Name);
    return dest;
  }
}
