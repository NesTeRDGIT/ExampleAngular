import { CheckPropertyService } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Статус сообщения */
export class Status {

  /** Код */
  Value = "";

  /** Наименование */
  Name = "";

  static Create(source: any): Status {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Status();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Value = String(source.Value);
    dest.Name = String(source.Name);
    return dest;
  }
}
