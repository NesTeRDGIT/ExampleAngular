import { CheckPropertyService, Convert } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Тип руководящей должности */
export class ChiefPosition {

  /** Код */
  Value = "";

  /** Наименование */
  Name = "";

  static Create(source: any): ChiefPosition {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new ChiefPosition();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Value = Convert.ConvertToString(source.Value);
    dest.Name = Convert.ConvertToString(source.Name);
    return dest;
  }
}
