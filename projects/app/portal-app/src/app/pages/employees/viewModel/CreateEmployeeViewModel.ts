import { Employee } from '@EmployeeModuleRoot/model/Employee';
import { IConvertible, ValidationField, ValidationModelBase, isEmpty, isNull, isNullOrDefault } from '@shared-lib';
import { Email } from '@shared-lib';

/** Проекция сотрудника */
export class CreateEmployeeViewModel extends ValidationModelBase<CreateEmployeeViewModel> implements IConvertible<Employee>  {

  constructor() {
    super();
    this.addValidatorForField(this.LastName, v => !isEmpty(v.LastName.Value), "Фамилия обязательна к заполнению");
    this.addValidatorForField(this.FirstName, v => !isEmpty(v.FirstName.Value), "Имя обязательно к заполнению");
    this.addValidatorForField(this.Sex, v => !isNullOrDefault(v.Sex.Value, 0), "Пол обязателен к заполнению");
    this.addValidatorForField(this.Birthday, v => !isNull(v.Birthday.Value), "Дата рождения обязательна к заполнению");
    this.addValidatorForField(this.Department, v => !isNullOrDefault(v.Department.Value, 0), "Отдел обязателен к заполнению");
    this.addValidatorForField(this.Post, v => !isNullOrDefault(v.Post.Value, 0), "Должность обязательна к заполнению");
    this.addValidatorForField(this.WorkplaceValue, v => !isNullOrDefault(v.WorkplaceValue.Value, 0), "Местоположение обязательно к заполнению");
    this.addValidatorForField(this.Email, v => !isNull(v.Email.Value) && Email.IsValid(v.Email.Value, false), "Некорректный Email");
    this.addValidatorForField(this.DateStart, v => !isNull(v.DateStart.Value), "Дата начала обязательна к заполнению");
    this.addValidatorForField(this.DateEnd, v => isNull(v.DateEnd.Value) || isNull(v.DateStart.Value) || v.DateStart.Value.TruncTime() < v.DateEnd.Value.TruncTime(), "Дата окончания должна быть больше даты начала", this.DateStart);
  }

  /** Идентификатор сотрудника */
  Id = 0;

  /** Электронная почта */
  readonly Email = new ValidationField('');

  /** Телефонный номер */
  Phone = "";

  /** Внутренний номер */
  InternalPhone = "";

  /** Фамилия */
  readonly LastName = new ValidationField("");

  /** Имя */
  readonly FirstName = new ValidationField("");

  /** Отчество */
  MiddleName = "";

  /** Дата рождения */
  readonly Birthday = new ValidationField(new Date());

  /** Пол */
  readonly Sex = new ValidationField(0);

  /** Идентификатор отдела */
  readonly Department = new ValidationField(0);

  /** Идентификатор должности */
  readonly Post = new ValidationField(0);

  /** Рабочего место наименование */
  WorkplaceName = "";

  /** Идентификатор рабочего места */
  readonly WorkplaceValue = new ValidationField(0);

  /** Дата начала */
  readonly DateStart = new ValidationField(new Date());

  /** Дата окончания */
  readonly DateEnd = new ValidationField<Date | null>(null);

  update(source: Employee): void {
    this.Id = source.Id;
    this.Email.Value = source.Email;
    this.Phone = source.Phone;
    this.InternalPhone = source.InternalPhone;
    this.FirstName.Value = source.FirstName;
    this.LastName.Value = source.LastName;
    this.MiddleName = source.MiddleName;
    this.Birthday.Value = source.Birthday;
    this.Sex.Value = source.Sex;
    this.Department.Value = source.Department;
    this.Post.Value = source.Post;
    this.WorkplaceName = source.WorkplaceName;
    this.WorkplaceValue.Value = source.WorkplaceValue;
    this.SetUntouched();
  }

  convert(): Employee {
    const dest = new Employee();
    dest.Id = this.Id;
    dest.Email = this.Email.Value;
    dest.Phone = this.Phone;
    dest.InternalPhone = this.InternalPhone;
    dest.FirstName = this.FirstName.Value;
    dest.LastName = this.LastName.Value;
    dest.MiddleName = this.MiddleName;
    dest.Birthday = this.Birthday.Value;
    dest.Sex = this.Sex.Value;
    dest.Department = this.Department.Value;
    dest.Post = this.Post.Value;
    dest.WorkplaceName = this.WorkplaceName;
    dest.WorkplaceValue = this.WorkplaceValue.Value;
    return dest;
  }
}

