import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';


@Component({
  selector: 'zms-filter-select',
  templateUrl: './filter-select.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterSelectComponent) }],
  host: { class: 'filter-select' }
})
export class FilterSelectComponent extends FilterItemBaseComponent<unknown[]> implements OnInit {

  _options: unknown[] = []
  /** Варианты для выбора */
  @Input() set options(values: unknown[]) {
    this._options = values;
    this.setDefault();
  }

  get options(): unknown[] {
    return this._options;
  }

  /** Поля для отображение */
  @Input() optionLabel = "";

  /** Поле для значения */
  @Input() optionValue = "";

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if (this.value == undefined) {
      this.value = [];
    }
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.in,this.custom, this.name, this.singleUrl);
      this.owner.filters.push(this.filter)
    }
    this.setDefault();
  }

  commitFilter = () => {
    if (this.filter) {
      this.filter.value = this.value;
    }
  }

  rollbackFilter = () => {
    if (this.filter && Array.isArray(this.filter.value)) {
      this.value = this.filter.value;
    } else {
      this.value = [];
    }
  };

  clearFilter = () => {
    if (this.filter) {
      this.filter.value = this.value = [];
    }
  }

  hasValue = (): boolean => {
    if (this.value) {
      return this.value.length !== 0;
    } else {
      return false;
    }
  }

  /** Установить значение по умолчанию */
  setDefault = () => {
    if (this.default !== undefined) {
      /** В массив значений */
      if (!Array.isArray(this.default)) {
        this.default = [this.default];
      }
      /** Если варианты уже установленны */
      if (this.options.length != 0) {
        this.value = [];
        for (const opt of this.options) {
          const obj: any = opt;
          const value = obj[this.optionValue];
          if (value != undefined) {
            for (const defItem of this.default) {
              if (defItem == value) {
                this.value?.push(value);
              }
            }
          }
        }
      } else {
        this.value = this.default;
      }
    }
  }

}
