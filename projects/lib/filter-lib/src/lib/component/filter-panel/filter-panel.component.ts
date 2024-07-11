import { Component, EventEmitter, AfterContentInit, Output, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { FilterEvent, FilterEventInvokeType } from '../../model/FilterEvent';
import { FilterField } from '../../model/FilterField'
import { FilterItemBaseComponent } from './filter-item-base/filter-item-base.component';
import { FieldInfo } from "../../model/FieldInfo";

@Component({
  selector: 'zms-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  host: { class: 'filter-panel' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements AfterContentInit {
  ngAfterContentInit(): void {
    this.onFilterInit();
  }
  /** Дочерние элементы */
  filterItems: FilterItemBaseComponent[] = [];

  /** Событие фильтрации */
  @Output() filter = new EventEmitter<FilterEvent>();

  /** Событие изначальной фильтрации */
  @Output() filterInit = new EventEmitter<FilterEvent>();

  buttonFilterText = input("Найти")
  buttonClearText = input("Очистить")

  /** Применен ли фильтр */
  isFilterApply = signal(false);

  /** Признак того, что все обязательные фильтры заполнены */
  isFull = signal(true);

  /** Добавить фильтр в панель */
  addFilterItem = (item: FilterItemBaseComponent): void => {
    this.filterItems.push(item);
    item.value$.subscribe({
      next: () => {
        this.updateIsFilterApply();
        this.updateIsFull();
      }
    });
  }

  /** Удалить фильтр из панели */
  removeFilterItem = (item: FilterItemBaseComponent): void => {
    const index = this.filterItems.indexOf(item);
    if (index >= 0) {
      this.filterItems.splice(index, 1);
      this.updateIsFilterApply();
      this.updateIsFull();
    }
  }

  private updateIsFilterApply = (): void => {
    const items = this.filterItems.filter(x => x.hasValue());
    this.isFilterApply.set(items.length !== 0);
  }

  private updateIsFull = (): void => {
    const items = this.filterItems.filter(x => x.required() && !x.hasValue());
    this.isFull.set(items.length === 0);
  }

  /** Очистить поля */
  clearFilter = (): void => {
    this.filterItems.forEach(x => x.clearFilter());
  }

  /** Фильтрация */
  onClickSubmit = (): void => {
    this.invokeFilterEvent('user');
  }

  /** Фильтрация */
  filterSubmit = (): void => {
    this.invokeFilterEvent('system');
  }

  /** Получить поля фильтрации */
  get filters(): FilterField[] {
    return this.filterItems.map(x => x.getFilterField()).flatMap(x => x);
  }

  private invokeFilterEvent = (invokeType: FilterEventInvokeType): void => {
    const event = new FilterEvent(invokeType);
    event.fields = this.filters.filter(x => x.hasValue || x.singleUrl).map(f => FilterField.Create(f.field, f.typeComparer, f.custom, f.key, f.singleUrl, f.value));
    this.filter?.emit(event);
  }

  private onFilterInit = (): void => {
    const event = new FilterEvent('system');
    event.fields = this.filters.filter(x => x.hasValue);
    if (event.fields.length !== null) {
      this.filterInit?.emit(event);
    }
  }

  onKeyUp = (e: KeyboardEvent): void => {
    if (e.key == "Enter") {
      this.filterSubmit();
    }
  }

  /** Установить значения по умолчанию */
  setDefaultValue = (fieldInfos: FieldInfo[]): void => {
    this.filterItems.forEach(filterItem => {
      //filterItem.default = [];
      filterItem.value.set(null);
    });

    const components: FilterItemBaseComponent<unknown>[] = [];
    fieldInfos.forEach(fieldInfo => {
      const component = this.filterItems.find(item => item.field().includes(fieldInfo.name));
      if (component) {
        component.default().push(fieldInfo);
        if (!components.includes(component)) {
          components.push(component);
        }
      }
    });

    components.forEach(component => component.setDefault());
  }
}