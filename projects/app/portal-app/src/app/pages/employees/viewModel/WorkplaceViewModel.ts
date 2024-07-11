import { Workplace } from "@EmployeeModuleRoot/model/dictionary/Workplace";
import { IConvertible, ValidationField, ValidationModelBase, isEmpty } from "@shared-lib";

/** Проекция рабочего места */
export class WorkplaceViewModel extends ValidationModelBase<WorkplaceViewModel> implements IConvertible<Workplace> {

  constructor() {
    super();
    this.addValidatorForField(this.Name, v => !isEmpty(v.Name.Value), "Наименование обязательно к заполнению");
  }

  /** Идентификатор */
  Value = 0;

  /** Наименование */
  readonly Name = new ValidationField("");

  /** Полное наименование */
  FullName = "";

  /** Признак офиса в районе */
  IsDistrictOffice = false;

  /** Признак главного офиса */
  IsMainOffice = false;

  /** Указатель на родителя */
  ParentId = 0;

  update(source: Workplace): void {
    this.Value = source.Value;
    this.Name.Value = source.Name;
    this.FullName = source.FullName;
    this.IsDistrictOffice = source.IsDistrictOffice;
    this.IsMainOffice = source.IsMainOffice;
    this.ParentId = source.ParentId;
    this.SetUntouched();
  }

  convert(): Workplace {
    const dest = new Workplace();
    dest.Value = this.Value;
    dest.Name = this.Name.Value;
    dest.FullName = this.FullName;
    dest.IsDistrictOffice = this.IsDistrictOffice;
    dest.IsMainOffice = this.IsMainOffice;
    dest.ParentId = this.ParentId;
    return dest;
  }
}
