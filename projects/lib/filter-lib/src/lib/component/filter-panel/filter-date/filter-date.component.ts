import { Component, forwardRef, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';


@Component({
  selector: 'zms-filter-date',
  templateUrl: './filter-date.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterDateComponent) }],
  host: { class: 'filter-date' }
})
export class FilterDateComponent extends FilterItemBaseComponent<Date | null> implements OnInit {

  constructor(public owner: FilterPanelComponent) {
    super(owner)
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.dateIs, this.custom, this.name, this.singleUrl);
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
      this.value = this.filter.value;
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
    return this.value !== null;
  }
}
