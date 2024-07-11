import { Observable, first } from 'rxjs';
import { FilterField } from '../model/FilterField';
import { FilterService } from '../service/filter.service';
import { Collection } from './Collection';
import { Signal } from '@angular/core';

/** Коллекция c фильтрацией */
export class FilterCollection<T = unknown> {

  /**  Фильтрованный список */
  private itemsFiltered = new Collection<T>([]);

  /** Базовый список */
  private baseItems = new Collection<T>([]);

  /** Последний примененный фильтр */
  private _lastFilter: FilterField[] = [];

  constructor(private filterService: FilterService, fullItems: T[]) {
    this.baseItems.update(fullItems);
  }

  /** Фильтрованные элементы */
  get items(): Signal<T[]> {
    return this.itemsFiltered.items;
  }

  /** Все элементы */
  get fullItems(): Signal<T[]> {
    return this.baseItems.items;
  }

  /** Последний примененный фильтр */
  get lastFilter(): readonly FilterField[] {
    return this._lastFilter;
  }

  /** Обновить коллекцию (новый набор + применение фильтров для нее)
   * @param items - новая коллекция
   * @param clearFilter - очистить примененные фильтры(по умолчанию false)
   */
  update = (items: T[], clearFilter = false) : void => {
    if (clearFilter) {
      this._lastFilter = [];
    }
    this.baseItems.update(items);
    this.resetFilter().pipe(first()).subscribe();
  }

  /** Фильтровать список */
  filter = (filterList: FilterField[] = []): Observable<void> => {
    this._lastFilter = filterList;
    return new Observable(sub => {
      if (this.lastFilter.length !== 0) {
        this.filterService.filterArray(this.baseItems.items(), this._lastFilter).pipe(first()).subscribe({
          next: (data) => { this.itemsFiltered.update(data); sub.next() },
          error: (error) => { sub.error(error) }
        });
      } else {
        this.itemsFiltered.update(this.baseItems.items());
        sub.next();
      }
    });
  }

  /**Обновить фильтрованные значения */
  resetFilter = (): Observable<void> => {
    return this.filter(this._lastFilter);
  }
}
