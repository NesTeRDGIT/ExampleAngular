import { Post } from '@EmployeeModuleRoot/model/dictionary/Post';
import { IConvertible, ValidationField, ValidationModelBase, isEmpty } from "@shared-lib";

/** Проекция должности */
export class PostViewModel extends ValidationModelBase<PostViewModel> implements IConvertible<Post> {

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

  /** Код типа руководящей должности */
  ChiefPositionValue = "";

  /** Наименование типа руководящей должности */
  ChiefPositionName = "";

  /** Приоритет */
  Priority = 0;

  update(source: Post): void {
    this.Id = source.Id;
    this.Name.Value = source.Name;
    this.ShortName = source.ShortName;
    this.Priority = source.Priority;
    this.ChiefPositionValue = source.ChiefPositionValue;
    this.ChiefPositionName = source.ChiefPositionName;
    this.SetUntouched();
  }

  convert(): Post {
    const dest = new Post();
    dest.Id = this.Id;
    dest.Name = this.Name.Value;
    dest.ShortName = this.ShortName;
    dest.Priority = this.Priority;
    dest.ChiefPositionValue = this.ChiefPositionValue;
    dest.ChiefPositionName = this.ChiefPositionName;
    return dest;
  }
}
