import { CheckPropertyService, Convert } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Должность */
export class Post {

  /** Код */
  Id = 0;

  /** Наименование */
  Name = "";

  /** Краткое наименование */
  ShortName = "";

  /** Код типа руководящей должности */
  ChiefPositionValue = "";

  /** Наименование типа руководящей должности */
  ChiefPositionName = "";

  /** Приоритет */
  Priority = 0;

  /** Главное наименование */
  get MainName(): string {
    return this.ShortName == '' ? this.Name : this.ShortName;
  }

  static Create(source: any): Post {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Post();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.Name = Convert.ConvertToString(source.Name);
    dest.ShortName = Convert.ConvertToString(source.ShortName);
    dest.ChiefPositionValue = Convert.ConvertToString(source.ChiefPositionValue);
    dest.ChiefPositionName = Convert.ConvertToString(source.ChiefPositionName);
    dest.Priority = Convert.ConvertToNumber(source.Priority);
    return dest;
  }
}
