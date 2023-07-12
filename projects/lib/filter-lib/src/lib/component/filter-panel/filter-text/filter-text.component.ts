import { Component, forwardRef, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';

@Component({
  selector: 'zms-filter-text',
  templateUrl: './filter-text.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterTextComponent) }],
  host: { class: 'filter-text' }
})
export class FilterTextComponent extends FilterItemBaseComponent<string> implements OnInit {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if(this.value == undefined){
      this.value = "";
    }
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.contains, this.custom, this.name, this.singleUrl);
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
    if (this.filter && typeof this.filter.value == "string") {
      this.value = this.filter.value;
    } else{
      this.value = "";
    }
  };

  clearFilter = () => {
    if (this.filter) {
      this.filter.value = this.value = "";
    }
  }

  hasValue = (): boolean => {
    return this.value !== "" && this.value !== null;
  }
}
