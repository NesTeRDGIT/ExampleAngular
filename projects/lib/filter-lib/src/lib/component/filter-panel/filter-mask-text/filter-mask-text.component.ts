import { Component, forwardRef, input, ChangeDetectionStrategy } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';
import { inputMaskType } from '@components-lib';

@Component({
  selector: 'zms-filter-mask-text',
  templateUrl: './filter-mask-text.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterMaskTextComponent) }],
  host: { class: 'filter-mask-text' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterMaskTextComponent extends FilterItemBaseComponent<string> {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if(this.value() == undefined){
      this.value.set("");
    }
  }

  /** Маска */
  mask = input.required<inputMaskType>();

  /** Значение без маски */
  unmask = input(false);

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.equals, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = () : void => {
    this.value.set("");
  }

  hasValue = (): boolean => {
    return this.value() !== "" && this.value() !== null;
  }
}
