import { Component, ContentChildren, EventEmitter, Input, AfterContentInit, Output, QueryList } from '@angular/core';
import { FilterEvent } from '../../model/FilterEvent';
import { FilterField } from '../../model/FilterField'
import { FilterItemBaseComponent } from './filter-item-base/filter-item-base.component';
import { FieldInfo } from "../../model/FieldInfo";

@Component({
  selector: 'zms-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  host: { class: 'filter-panel' }
})
export class FilterPanelComponent implements AfterContentInit {
  ngAfterContentInit(): void {
    this.onFilterInit();
  }

  /** Поля фильтрации */
  filters: FilterField[] = [];

  /** Дочерние элементы */
  @ContentChildren(FilterItemBaseComponent) filterItems = new QueryList<FilterItemBaseComponent<unknown>>()

  /** Событие фильтрации */
  @Output() filter: EventEmitter<FilterEvent> = new EventEmitter();

  /** Событие изначальной фильтрации */
  @Output() filterInit: EventEmitter<FilterEvent> = new EventEmitter();

  @Input() buttonFilterText = "Найти"
  @Input() buttonClearText = "Очистить"

  /** Применен ли фильтр */
  get IsFilterApply(): boolean {
    return this.filterItems.filter(x => x.hasValue()).length !== 0;
  }

  /** Очистить поля */
  clearFilter = () => {
    this.filterItems.forEach(x => x.clearFilter());
    //this.filterSubmit();
  }

  /**Фиксировать фильтр */
  commitFilter = () => {
    this.filterItems.forEach(x => x.commitFilter());
  }

  /** Откатить фильтр */
  rollbackFilter = () => {
    this.filterItems.forEach(x => x.rollbackFilter());
  }

  /** Фильтрация */
  filterSubmit = () => {
    this.commitFilter();
    const event = new FilterEvent();
    event.fields = this.filters.filter(x => x.hasValue || x.singleUrl);
    this.filter?.emit(event);
  }

  private onFilterInit = () => {
    this.commitFilter();
    const event = new FilterEvent();
    event.fields = this.filters.filter(x => x.hasValue);
    if (event.fields.length !== null) {
      this.filterInit?.emit(event);
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      this.filterSubmit();
    }
  }

  /** Установить значения по умолчанию */
  setDefaultValue = (values: FieldInfo[]) => {
    this.filterItems.forEach(x => {
      x.default = undefined;
      x.value = null;
    });

    values.forEach(x => {
      const filter = this.filters.find(f => f.field.includes(x.name));
      if (filter) {
        const component = this.filterItems.find(x => x.filter == filter);
        if (component) {
          component.default = x.value;
          component.setDefault();
        }
      }
    });
  }
}
