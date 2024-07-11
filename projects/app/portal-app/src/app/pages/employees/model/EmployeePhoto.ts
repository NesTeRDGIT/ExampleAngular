import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Фотография сотрудника */
export class EmployeePhoto {

  /** Идентификатор фотографии */
  Id = 0;

  /** Идентификатор сотрудника */
  EmployeeId = 0;

  /** Наименование файла */
  Name = "";

  static Create(source: any): EmployeePhoto {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new EmployeePhoto();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.EmployeeId = Convert.ConvertToNumber(source.EmployeeId);
    dest.Name = Convert.ConvertToString(source.Name);
    return dest;
  }
}
