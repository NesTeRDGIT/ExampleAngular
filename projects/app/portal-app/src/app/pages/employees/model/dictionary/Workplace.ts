import { CheckPropertyService, Convert } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Проекция рабочего места */
export class Workplace {

  /** Идентификатор */
  Value = 0;

  /** Наименование */
  Name = "";

  /** Полное наименование */
  FullName = "";

  /** Признак офиса в районе */
  IsDistrictOffice = false;

  /** Признак главного офиса */
  IsMainOffice = false;

  /** Указатель на родителя */
  ParentId = 0;

  static Create(source: any): Workplace {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Workplace();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Value = Convert.ConvertToNumber(source.Value);
    dest.Name = Convert.ConvertToString(source.Name);
    dest.FullName = Convert.ConvertToString(source.FullName);
    dest.IsDistrictOffice = Convert.ConvertToBoolean(source.IsDistrictOffice);
    dest.IsMainOffice = Convert.ConvertToBoolean(source.IsMainOffice);
    dest.ParentId = Convert.ConvertToNumber(source.ParentId);
    return dest;
  }
}
