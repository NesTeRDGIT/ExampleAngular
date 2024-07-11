import { Replacement } from '@EmployeeModuleRoot/model/Replacement';
import { IConvertible, ValidationField, ValidationModelBase, isEmpty, isNull, isNullOrDefault } from "@shared-lib";

/** Проекция рабочего места */
export class ReplacementViewModel extends ValidationModelBase<ReplacementViewModel> implements IConvertible<Replacement> {

  constructor() {
    super();
    this.addValidatorForField(this.EmployeeId, v => !isNullOrDefault(v.EmployeeId.Value, 0), "Замещаемый сотрудник обязателен к заполнению");
    this.addValidatorForField(this.SubstituteId, v => !isNullOrDefault(v.SubstituteId.Value, 0), "Замещающий сотрудник обязателен к заполнению");
    this.addValidatorForField(this.PostTitle, v => !isEmpty(v.PostTitle.Value), "Наименование должности обязательно к заполнению");
    this.addValidatorForField(this.AuthorityNumber, v => !isEmpty(v.AuthorityNumber.Value), "Номер доверенности обязателен к заполнению");
    this.addValidatorForField(this.AuthorityDate, v => !isNull(v.AuthorityDate.Value), "Дата доверенности обязательна к заполнению");
    this.addValidatorForField(this.DateStart, v => !isNull(v.DateStart.Value), "Дата начала обязательна к заполнению");
    this.addValidatorForField(this.DateEnd, v => !isNull(v.DateEnd.Value), "Дата окончания обязательна к заполнению");
    this.addValidatorForField(this.DateEnd, v => isNull(v.DateEnd.Value) || isNull(v.DateStart.Value) || v.DateStart.Value.TruncTime() <= v.DateEnd.Value.TruncTime(), "Дата окончания должна быть больше даты начала", this.DateStart);
  }

  /** Идентификатор */
  Id = 0;

  /** Идентификатор замещаемого сотрудника */
  readonly EmployeeId = new ValidationField(0);

  /** Идентификатор замещающего сотрудника */
  readonly SubstituteId = new ValidationField(0);

  /** ФИО замещающего сотрудника */
  SubstituteFullName = '';

  /** Дата начала */
  readonly DateStart = new ValidationField(new Date());

  /** Дата окончания */
  readonly DateEnd = new ValidationField(new Date());

  /** Номер доверенности */
  readonly AuthorityNumber = new ValidationField('');

  /** Дата доверенности */
  readonly AuthorityDate = new ValidationField(new Date());

  /** Название должности замещения */
  readonly PostTitle = new ValidationField('');

  /** Признак начавшегося замещения */
  Started = false;

  /** Признак завершенного замещения */
  Ended = false;

  update(source: Replacement): void {
    this.Id = source.Id;
    this.EmployeeId.Value = source.EmployeeId;
    this.SubstituteId.Value = source.SubstituteId;
    this.SubstituteFullName = source.SubstituteFullName;
    this.DateStart.Value = source.DateStart;
    this.DateEnd.Value = source.DateEnd;
    this.AuthorityNumber.Value = source.AuthorityNumber;
    this.AuthorityDate.Value = source.AuthorityDate;
    this.PostTitle.Value = source.PostTitle;
    this.Started = source.Started;
    this.Ended = source.Ended;
    this.SetUntouched();
  }

  convert(): Replacement {
    const dest = new Replacement();
    dest.Id = this.Id;
    dest.EmployeeId = this.EmployeeId.Value;
    dest.SubstituteId = this.SubstituteId.Value;
    dest.SubstituteFullName = this.SubstituteFullName;
    dest.DateStart = this.DateStart.Value;
    dest.DateEnd = this.DateEnd.Value;
    dest.AuthorityNumber = this.AuthorityNumber.Value;
    dest.AuthorityDate = this.AuthorityDate.Value;
    dest.PostTitle = this.PostTitle.Value;
    dest.Started = this.Started;
    dest.Ended = this.Ended;
    return dest;
  }
}
