import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';
import { Calendar, CalendarTypeView } from 'primeng/calendar';


@Component({
  selector: 'zms-filter-date-range',
  templateUrl: './filter-date-range.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterDateRangeComponent) }],
  styleUrls: ['./filter-date-range.component.scss'],
  host: { class: 'filter-date' }
})
export class FilterDateRangeComponent extends FilterItemBaseComponent<Date[]> implements OnInit {
  constructor(public owner: FilterPanelComponent) {
    super(owner)
    if (this.value == undefined) {
      this.value = [];
    }
  }
  private _view: DateRangeTypeView = 'date'
  /** Стиль элемента */
  @Input() set view(value: DateRangeTypeView) {
    this._view = value;
    switch (value) {
      case 'year':
        this.dateFormat = "yy";
        this.calendarTypeView = 'year'
        break;
      case 'month':
        this.dateFormat = "mm.yy";
        this.calendarTypeView = 'month'
        break;
      case 'date':
        this.dateFormat = "dd.mm.yy";
        this.calendarTypeView = 'date'
        break;
    }
  }
  get view(): DateRangeTypeView {
    return this._view;
  }

  /** Формат календаря */
  dateFormat = "dd.mm.yy";

  /** Формат окна выбора */
  calendarTypeView : CalendarTypeView = 'date'

  onClose = () => {
    if (!this.IsFullRange()) {
      this.value = [];
    }
  }

  private IsFullRange = (): boolean => {
    if (!Array.isArray(this.value))
      return false;
    if (this.value[0] == null || this.value[1] == null)
      return false;
    return true;
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.between, this.custom, this.name, this.singleUrl);
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
    if (this.filter && Array.isArray(this.filter.value)) {
      this.value = this.filter.value;
    } else {
      this.value = [];
    }
  };

  clearFilter = () => {
    if (this.filter) {
      this.value = [];
    }
  }

  hasValue = (): boolean => {
    if (Array.isArray(this.value)) {
      return this.value.length == 2 && this.value[0] !== null && this.value[1] !== null;
    } else {
      return false
    }
  }

  @ViewChild("calendar") calendar: Calendar | undefined;
  onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !this.hasValue()) {
      if (this.calendar) {
        this.value = [];
      }
    }
  }

  /** Установить значение по умолчанию */
  setDefault = () => {
    if (this.default !== undefined) {
      /** В массив значений */
      if (!Array.isArray(this.default)) {
        this.default = [this.default];
      }
      this.value = this.default.map(x => new Date(x));
    }
  }
}

export type DateRangeTypeView = 'date' | 'month' | 'year'
