import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';

@Component({
  selector: 'zms-filter-text',
  templateUrl: './filter-text.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterTextComponent) }],
  host: { class: 'filter-text' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTextComponent extends FilterItemBaseComponent<string> {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if(this.value() == undefined){
      this.value.set("");
    }
  }

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.contains, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = () : void => {
    this.value.set("");
  }

  hasValue = (): boolean => {
    return this.value() !== "" && this.value() !== null;
  }
}
