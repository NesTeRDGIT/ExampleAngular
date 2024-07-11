import { CheckPropertyService, Convert } from '@shared-lib';
import { ArgumentNullException } from '@shared-lib';

/** Проекция элемента сотрудника */
export class EmployeeCardItem {

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

  /** ФИО */
  FullName = "";

  /** Дата рождения */
  Birthday = new Date();

  /** Пол */
  Sex = 0;

  /** Идентификатор отдела */
  DepartmentValue = 0;

  /** Наименование отдела */
  DepartmentName = "";

  /** Краткое наименование отдела */
  DepartmentShortName = "";

  /** Идентификатор должности */
  PostValue = 0;

  /** Наименование должности */
  PostName = "";

  /** Краткое наименование должности */
  PostShortName = "";

  /** Идентификатор рабочего места */
  WorkplaceValue = 0;

  /** Наименование рабочего места */
  WorkplaceName = "";

  /** Признак рабочего места в районе */
  WorkplaceDistrictOffice = false;

  /** Признак рабочего места в главном офисе */
  WorkplaceMainOffice = false;

  /** Фотография */
  AvatarPhotoId = 0;

  /** Признак - сегодня день рождения */
  IsBirthday = false;

  /** Признак - день рождения через 10 дней */
  IsBirthday10Day = false;

  /** Возраст юбилея
   * @description Сегодня или через 10 дней, 50, 55, 60, 65 ...
   */
  AnniversaryAge: number | null = null;

  static Create(source: any): EmployeeCardItem {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new EmployeeCardItem();
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
    dest.FullName = Convert.ConvertToString(source.FullName);
    dest.Birthday = Convert.ConvertToDate(source.Birthday);
    dest.Sex = Convert.ConvertToNumber(source.Sex);
    dest.DepartmentValue = Convert.ConvertToNumber(source.DepartmentValue)
    dest.DepartmentName = Convert.ConvertToString(source.DepartmentName);
    dest.DepartmentShortName = Convert.ConvertToString(source.DepartmentShortName);
    dest.PostValue = Convert.ConvertToNumber(source.PostValue);
    dest.PostName = Convert.ConvertToString(source.PostName);
    dest.PostShortName = Convert.ConvertToString(source.PostShortName);
    dest.AvatarPhotoId = Convert.ConvertToNumber(source.AvatarPhotoId);
    dest.WorkplaceValue = Convert.ConvertToNumber(source.WorkplaceValue);
    dest.WorkplaceName = Convert.ConvertToString(source.WorkplaceName);
    dest.WorkplaceDistrictOffice = Convert.ConvertToBoolean(source.WorkplaceDistrictOffice);
    dest.WorkplaceMainOffice = Convert.ConvertToBoolean(source.WorkplaceMainOffice);
    dest.IsBirthday = Convert.ConvertToBoolean(source.IsBirthday);
    dest.IsBirthday10Day = Convert.ConvertToBoolean(source.IsBirthday10Day);
    dest.AnniversaryAge = Convert.ConvertToNumberOrNull(source.AnniversaryAge);

    return dest;
  }
}
