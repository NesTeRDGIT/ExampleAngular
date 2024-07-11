import { CheckPropertyService, Convert } from '@shared-lib';
import { ArgumentNullException } from '@shared-lib';

/** Проекция сотрудника */
export class Employee {

  /** Идентификатор сотрудника */
  Id = 0;

  /** Электронная почта */
  Email = "";

  /** Телефонный номер */
  Phone = "";

  /** Внутренний номер */
  InternalPhone = "";

  /** Фамилия */
  LastName = "";

  /** Имя */
  FirstName = "";

  /** Отчество */
  MiddleName = "";

  /** Дата рождения */
  Birthday = new Date();

  /** Пол */
  Sex = 0;

  /** Идентификатор отдела */
  Department = 0;

  /** Идентификатор должности */
  Post = 0;

  /** Рабочего место наименование */
  WorkplaceName = "";

  /** Идентификатор рабочего места */
  WorkplaceValue = 0;

  static Create(source: any): Employee {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Employee();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.Email = Convert.ConvertToString(source.Email);
    dest.Phone = Convert.ConvertToString(source.Phone);
    dest.InternalPhone = Convert.ConvertToString(source.InternalPhone);
    dest.FirstName = Convert.ConvertToString(source.FirstName);
    dest.LastName = Convert.ConvertToString(source.LastName);
    dest.MiddleName = Convert.ConvertToString(source.MiddleName);
    dest.Birthday = Convert.ConvertToDate(source.Birthday);
    dest.Sex = Convert.ConvertToNumber(source.Sex);
    dest.Department = Convert.ConvertToNumber(source.Department);
    dest.Post = Convert.ConvertToNumber(source.Post);
    dest.WorkplaceName = Convert.ConvertToString(source.WorkplaceName);
    dest.WorkplaceValue = Convert.ConvertToNumber(source.WorkplaceValue);
    return dest;
  }
}
