import { Component, forwardRef, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { TypeComparer } from '../../../model/TypeComparer';

import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';

@Component({
  selector: 'zms-filter-check-box',
  templateUrl: './filter-check-box.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterCheckBoxComponent) }],
  host: { class: 'filter-date' }
})
export class FilterCheckBoxComponent extends FilterItemBaseComponent<boolean | null> implements OnInit {

  constructor(public owner: FilterPanelComponent) {
    super(owner)
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.equals, this.custom, this.name, this.singleUrl);
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
    if (this.filter && this.filter.value instanceof Date) {
      this.value = this.filter.value = false;
    } else {
      this.value = null;
    }
  };

  clearFilter = () => {
    if (this.filter) {
      this.filter.value = this.value = null;
    }
  }

  hasValue = (): boolean => {
    return this.value != null;
  }


  /** Установить значение по умолчанию */
  setDefault = ()=>{
    if(this.default !== undefined) {
      this.value = Boolean(this.default);
    }
  }
}
