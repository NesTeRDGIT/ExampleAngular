import { CheckPropertyService, Convert } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Пол */
export class Sex {

  /** Код */
  Value = 0;

  /** Наименование */
  Name = "";

  static Create(source: any): Sex {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Sex();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Value = Convert.ConvertToNumber(source.Value);
    dest.Name = Convert.ConvertToString(source.Name);
    return dest;
  }
}
