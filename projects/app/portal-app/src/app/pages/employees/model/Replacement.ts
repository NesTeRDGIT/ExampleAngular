import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Проекция замещения */
export class Replacement {

  /** Идентификатор */
  Id = 0;

  /** Идентификатор замещаемого сотрудника */
  EmployeeId = 0;

  /** Идентификатор замещающего сотрудника */
  SubstituteId = 0;

  /** ФИО замещающего сотрудника */
  SubstituteFullName = '';

  /** Дата начала */
  DateStart = new Date();

  /** Дата окончания */
  DateEnd = new Date();

  /** Номер доверенности */
  AuthorityNumber = '';

  /** Дата доверенности */
  AuthorityDate = new Date();

  /** Название должности замещения */
  PostTitle = '';

  /** Признак начавшегося замещения */
  Started = false;

  /** Признак завершенного замещения */
  Ended = false;

  static Create(source: any): Replacement {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Replacement();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.EmployeeId = Convert.ConvertToNumber(source.EmployeeId);
    dest.SubstituteId = Convert.ConvertToNumber(source.SubstituteId);
    dest.SubstituteFullName = Convert.ConvertToString(source.SubstituteFullName);
    dest.DateStart = Convert.ConvertToDate(source.DateStart);
    dest.DateEnd = Convert.ConvertToDate(source.DateEnd);
    dest.AuthorityNumber = Convert.ConvertToString(source.AuthorityNumber);
    dest.AuthorityDate = Convert.ConvertToDate(source.AuthorityDate);
    dest.PostTitle = Convert.ConvertToString(source.PostTitle);
    dest.Started = Convert.ConvertToBoolean(source.Started);
    dest.Ended = Convert.ConvertToBoolean(source.Ended);
    return dest;
  }
}
