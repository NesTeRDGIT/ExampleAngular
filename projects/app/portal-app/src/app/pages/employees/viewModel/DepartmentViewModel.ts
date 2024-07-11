import { Department } from '@EmployeeModuleRoot/model/dictionary/Department';
import { IConvertible, ValidationField, ValidationModelBase, isEmpty } from "@shared-lib";

/** Проекция отдела */
export class DepartmentViewModel extends ValidationModelBase<DepartmentViewModel> implements IConvertible<Department> {

  constructor() {
    super();
    this.addValidatorForField(this.Name, v => !isEmpty(v.Name.Value), "Наименование обязательно к заполнению");
  }

  /** Идентификатор */
  Id = 0;

  /** Наименование */
  readonly Name = new ValidationField("");

  /** Краткое наименование */
  ShortName = "";

  /** Приоритет */
  Priority = 0;

  update(source: Department): void {
    this.Id = source.Id;
    this.Name.Value = source.Name;
    this.ShortName = source.ShortName;
    this.Priority = source.Priority;
    this.SetUntouched();
  }

  convert(): Department {
    const dest = new Department();
    dest.Id = this.Id;
    dest.Name = this.Name.Value;
    dest.ShortName = this.ShortName;
    dest.Priority = this.Priority;
    return dest;
  }
}
