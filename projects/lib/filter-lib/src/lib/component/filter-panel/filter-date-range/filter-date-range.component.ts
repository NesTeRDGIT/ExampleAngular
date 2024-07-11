import { ChangeDetectionStrategy, Component, forwardRef, input, ViewChild } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';
import { DatePickerComponent, DatePickerTypeView } from '@components-lib';
import { DateType } from '../../../type/DateType';

@Component({
  selector: 'zms-filter-date-range',
  templateUrl: './filter-date-range.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterDateRangeComponent) }],
  styleUrls: ['./filter-date-range.component.scss'],
  host: { class: 'filter-date' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateRangeComponent extends FilterItemBaseComponent<(DateType | null)[]> {
  constructor(public owner: FilterPanelComponent) {
    super(owner)
    if (this.value() == undefined) {
      this.value.set(null);
    }
  }

  /** Стиль элемента */
  view =  input<DatePickerTypeView>('date');

  /** Автоматически определять время */
  autoTime = input(false);

  /** Отправлять время  */
  sendTime = input(false);

  /** Введенное значение */
  private inputValue: (DateType | null)[] | undefined = undefined;

  /** Конвертация даты по параметрам элемента */
  convertValue = (value: Date[]) : void => {
    if (value == null) {
      this.inputValue = [];
    } else {
      this.inputValue = value.map(x => x == null ? null : new DateType(x, this.sendTime()));
    }
  }

  onClose = () : void => {
    this.fixValue();
  }

  @ViewChild('calendar') calendar : DatePickerComponent | undefined = undefined;
  /** Фиксация значения */
  private fixValue = (): boolean=>{
    let result = false;
    if (this.inputValue !== undefined){
      if (this.isFullRange(this.inputValue)) {
        if (this.autoTime()) {
          if (this.inputValue[0]) {
            this.inputValue[0] = this.inputValue[0].TruncTime();
          }
          if (this.inputValue[1]) {
            this.inputValue[1].setHours(23, 59, 59);
          }
        }
        this.value.set(this.inputValue);
        result = true;
      } else {
        this.calendar?.writeValue(null);
        this.value.set(null);
      }
      this.inputValue = undefined;
      return result;
    }
    return result;
  }

  private isFullRange = (value: (DateType | null)[]): boolean => {
    return Array.isArray(value) && value.length == 2 && value[0] !== null && value[1] !== null;
  }

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.between, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = () : void => {
    this.value.set(null);
  }

  hasValue = (): boolean => {
    const value = this.value();
    if (Array.isArray(value)) {
      return value.length == 2 && value[0] !== null && value[1] !== null;
    } else {
      return false
    }
  }

  onKeyUp = (e: KeyboardEvent) : void => {
    if (e.key === "Enter") {
      this.fixValue();
    }
  }

  onBlur = () : void => {
    this.fixValue();
  }

  /** Установить значение по умолчанию */
  override setDefault = () : void => {
    const defaultItems = this.default().flatMap(x => Array.isArray(x.value) ? x.value : [x.value]);
    if (defaultItems.length !== 0) {
      this.value.set(defaultItems.map((x:any) => new DateType(new Date(x), this.sendTime())));
    }
  }
}
