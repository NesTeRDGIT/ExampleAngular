import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';

@Component({
  selector: 'zms-filter-number',
  templateUrl: './filter-number.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterNumberComponent) }],
  host: { class: 'filter-number' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNumberComponent extends FilterItemBaseComponent<number> {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if(this.value() == undefined){
      this.value.set(null);
    }
  }

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.equals, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = () : void => {
    this.value.set(null);
  }

  hasValue = (): boolean => {
    return this.value() !== null;
  }
}
