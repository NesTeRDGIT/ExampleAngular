import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { TypeComparer } from '../../../model/TypeComparer';

import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { Convert } from '@shared-lib';

@Component({
  selector: 'zms-filter-check-box',
  templateUrl: './filter-check-box.component.html',
  styleUrl: './filter-check-box.component.scss',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterCheckBoxComponent) }],
  host: { class: 'filter-date' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCheckBoxComponent extends FilterItemBaseComponent<boolean | null> {

  constructor(public owner: FilterPanelComponent) {
    super(owner)
  }

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.equals, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = (): void => {
    this.value.set(null);
  }

  hasValue = (): boolean => {
    return this.value() != null;
  }

  /** Установить значение по умолчанию */
  override setDefault = (): void => {
    if (this.default().length !== 0) {
      this.value.set(this.convertToBoolean(this.default()[0].value));
    }
  }

  private convertToBoolean = (value: unknown): boolean => {
    if (typeof value == 'string') {
      return value == 'true';
    }
    return Convert.ConvertToBoolean(value);
  }
}
