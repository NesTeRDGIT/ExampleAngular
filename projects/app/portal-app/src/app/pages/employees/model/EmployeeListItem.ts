import { CheckPropertyService, Convert } from '@shared-lib';
import { ArgumentNullException } from '@shared-lib';

/** Проекция элемента списка сотрудников */
export class EmployeeListItem {

  /** Идентификатор сотрудника */
  Id = 0;

  /** ФИО */
  FullName = "";

  /** Дата рождения */
  Birthday = new Date();

  /** Идентификатор отдела */
  DepartmentValue = 0;

  /** Наименование отдела */
  DepartmentName = "";

  /** Идентификатор должности */
  PostValue = 0;

  /** Наименование должности */
  PostName = "";

  /** Действующий сотрудник */
  IsActive = false;

  static Create(source: any): EmployeeListItem {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new EmployeeListItem();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.FullName = Convert.ConvertToString(source.FullName);
    dest.Birthday = Convert.ConvertToDate(source.Birthday);
    dest.DepartmentValue = Convert.ConvertToNumber(source.DepartmentValue)
    dest.DepartmentName = Convert.ConvertToString(source.DepartmentName);
    dest.PostValue = Convert.ConvertToNumber(source.PostValue);
    dest.PostName = Convert.ConvertToString(source.PostName);
    dest.IsActive = Convert.ConvertToBoolean(source.IsActive);

    return dest;
  }
}
