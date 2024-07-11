import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Проекция периода работы */
export class WorkPeriod {

  /** Идентификатор */
  Id = 0;

  /** Идентификатор сотрудника */
  EmployeeId = 0;

  /** Дата начала */
  DateStart = new Date();

  /** Дата окончания */
  DateEnd: Date | null = null;

  static Create(source: any): WorkPeriod {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new WorkPeriod();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.EmployeeId = Convert.ConvertToNumber(source.EmployeeId);
    dest.DateStart = Convert.ConvertToDate(source.DateStart);
    dest.DateEnd = Convert.ConvertToDateOrNull(source.DateEnd);
    return dest;
  }
}
