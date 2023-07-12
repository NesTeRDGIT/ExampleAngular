import { Component, forwardRef, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';

@Component({
  selector: 'zms-filter-number',
  templateUrl: './filter-number.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterNumberComponent) }],
  host: { class: 'filter-number' }
})
export class FilterNumberComponent extends FilterItemBaseComponent<number> implements OnInit {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if(this.value == undefined){
      this.value = null;
    }
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
    if (this.filter && typeof this.filter.value == "number") {
      this.value = this.filter.value;
    } else{
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
