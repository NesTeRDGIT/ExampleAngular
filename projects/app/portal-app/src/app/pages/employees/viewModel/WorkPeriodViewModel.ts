import { WorkPeriod } from '@EmployeeModuleRoot/model/WorkPeriod';
import { IConvertible, ValidationField, ValidationModelBase, isNull } from "@shared-lib";

/** Проекция рабочего периода */
export class WorkPeriodViewModel extends ValidationModelBase<WorkPeriodViewModel> implements IConvertible<WorkPeriod> {

  constructor() {
    super();
    this.addValidatorForField(this.DateStart, v => !isNull(v.DateStart.Value), "Дата начала обязательна к заполнению");
    this.addValidatorForField(this.DateEnd, v => isNull(v.DateEnd.Value) || isNull(v.DateStart.Value) || v.DateStart.Value.TruncTime() <= v.DateEnd.Value.TruncTime(), "Дата окончания должна быть больше даты начала", this.DateStart);
  }

  /** Идентификатор */
  Id = 0;

  /** Идентификатор сотрудника */
  EmployeeId = 0;

  /** Дата начала */
  readonly DateStart = new ValidationField(new Date());

  /** Дата окончания */
  readonly DateEnd = new ValidationField<Date | null>(null);

  update(source: WorkPeriod): void {
    this.Id = source.Id;
    this.EmployeeId = source.EmployeeId;
    this.DateStart.Value = source.DateStart;
    this.DateEnd.Value = source.DateEnd;
    this.SetUntouched();
  }

  convert(): WorkPeriod {
    const dest = new WorkPeriod();
    dest.Id = this.Id;
    dest.EmployeeId = this.EmployeeId;
    dest.DateStart = this.DateStart.Value;
    dest.DateEnd = this.DateEnd.Value;
    return dest;
  }
}
