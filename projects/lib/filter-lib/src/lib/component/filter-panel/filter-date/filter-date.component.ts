import { computed, input } from '@angular/core';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';
import { DateType } from '../../../type/DateType';
import { FieldInfo } from '../../../model/FieldInfo';
import { DatePickerTypeView } from '@components-lib';
import { Convert } from '@shared-lib';


@Component({
  selector: 'zms-filter-date',
  templateUrl: './filter-date.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterDateComponent) }],
  host: { class: 'filter-date' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateComponent extends FilterItemBaseComponent<DateType | null> {

  constructor(public owner: FilterPanelComponent) {
    super(owner)
  }

  /** Стиль элемента */
  view = input<DatePickerTypeView>('date');

  /** Формат календаря */
  dateFormat = computed(() => {
    switch (this.view()) {
      case 'year':
        return "yy";
      case 'month':
        return "mm.yy";
      default:
        return "dd.mm.yy";
    }
  });

  /** Отправлять время */
  sendTime = input(false);

  /** Разделить дату на составные части */
  separate = input(false);

  /** Конвертация значения по параметрам элемента */
  convertValue = (value: Date | null) : void => {
    this.value.set(value == null ? null : new DateType(value, this.sendTime()));
  }

  getFilterField = (): FilterField[] => {
    if (this.separate()) {
      const filter: FilterField[] = [];
      const value = this.value();
      if (value != null) {
        if (this.field.length >= 1) {
          filter.push(FilterField.Create([this.field()[0]], TypeComparer.equals, false, '', this.singleUrl(), value.getFullYear()))
        }
        if (this.field.length >= 2) {
          filter.push(FilterField.Create([this.field()[1]], TypeComparer.equals, false, '', this.singleUrl(), value.getMonth() + 1))
        }
        if (this.field.length >= 3) {
          filter.push(FilterField.Create([this.field()[2]], TypeComparer.equals, false, '', this.singleUrl(), value.getDate()))
        }
      }
      return filter;
    } else {
      return [FilterField.Create(this.field(), TypeComparer.dateIs, false, '', this.singleUrl(), this.value())];
    }
  }

  clearFilter = () : void => {
    this.value.set(null);
  }

  hasValue = (): boolean => {
    return this.value() !== null;
  }

  /** Установить значение по умолчанию */
  override setDefault = () : void => {
    const def = this.default();
    if (def.length !== 0) {
      if (this.separate()) {

        let yearDefault: FieldInfo | undefined = undefined;
        let monthDefault: FieldInfo | undefined = undefined;
        let dayDefault: FieldInfo | undefined = undefined;

        if (this.field.length >= 1) {
          yearDefault = def.find(x => x.name == this.field()[0]);
        }
        if (this.field.length >= 2) {
          monthDefault = def.find(x => x.name == this.field()[1]);
        }
        if (this.field.length >= 3) {
          dayDefault = def.find(x => x.name == this.field()[2]);
        }
        const year = yearDefault ? Convert.ConvertToNumber(yearDefault.value) : 0;
        const month = monthDefault ? Convert.ConvertToNumber(monthDefault.value) - 1 : 1;
        const day = dayDefault ? Convert.ConvertToNumber(dayDefault.value) : 1;
        this.value.set(new DateType(new Date(year, month, day), this.sendTime()));

      } else {
        const value = Convert.ConvertToString(def[0].value);
        this.value.set(new DateType(new Date(value), this.sendTime()));
      }
    }
  }
}
