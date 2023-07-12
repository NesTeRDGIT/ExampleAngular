import { Component, Input, OnInit } from "@angular/core";
import { FilterPanelComponent } from "../filter-panel.component";
import { FilterField } from "../../../model/FilterField";

@Component({
  selector: 'zms-filter-item-base',
  template: '<div></div>',
  host: { class: 'filter-item' }
})
export abstract class FilterItemBaseComponent<T> implements OnInit  {
  owner: FilterPanelComponent
  @Input() header = "";

  /** Поле для фильтрации */
  @Input() field: string | undefined = undefined;

  /** Значение фильтра по умолчанию */
  @Input() default: T | undefined;

  /** Имя фильтра */
  @Input() name = "";

  /** Признак фильтрации как отдельный компонент
   * Т.е. при обработке фильтра ServerSide будет указано отдельное значение с именем параметра name
   */
  @Input() singleUrl = false;

  @Input() custom = false;

  /** Значение */
  value: T | null = null;

  /** Фильтр */
  filter: FilterField | null = null;

  constructor(owner: FilterPanelComponent) {
    this.owner = owner;
    if(this.default !== undefined){
      this.value = this.default;
    }
  }

  ngOnInit(): void {
    if(this.default !== undefined){
      this.value = this.default;
    }
  }

  /** Установить значение по умолчанию */
  setDefault = ()=>{
    if(this.default !== undefined){
      this.value = this.default;
    }
  }

  /** Очистить фильтр */
  abstract clearFilter: () => void;

  /** Фиксировать фильтр */
  abstract commitFilter: () => void;

  /** Откатить значение фильтра */
  abstract rollbackFilter: () => void;

  /** Указано ли значение в компоненте */
  abstract hasValue: () => boolean;
}
