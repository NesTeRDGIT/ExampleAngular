import { Observable } from 'rxjs';
import { FilterField } from '../model/FilterField';
import { FilterService } from '../service/filter.service';
import { Collection } from './Collection';

/** Коллекция для фильтрации */
export class FilterCollection<T>{

  /**  Фильтрованный список */
  private itemsFiltered = new Collection<T>([]);

  /** Базовый список */
  private baseItems = new Collection<T>([]);

  /** Последний примененный фильтр */
  private _lastFilter: FilterField[] = [];

  constructor(private filterService: FilterService, fullItems: T[]) {    
    this.baseItems.updateItems(fullItems);
  }

  /** Фильтрованные элементы */
  get items(): T[] {
    return this.itemsFiltered.items;
  }

  /** Все элементы */
  get fullItems(): T[] {
    return this.baseItems.items;
  }

  /** Последний примененный фильтр */
  get lastFilter(): ReadonlyArray<FilterField> {
    return this._lastFilter;
  }

  /** Сброс элементов (новый класс массива с теми же элементами) */
  resetItems = () => {
    this.itemsFiltered.resetItems();
  }

  /** Сбросить элементы(новый набор + сброс фильтров) */
  updateItems = (items: T[], clearFilter = false) => {
    if (clearFilter) {
      this._lastFilter = [];
    }
    this.baseItems.updateItems(items);
    this.resetFilter().subscribe();
  }


  /** Фильтровать список */
  filter = (filterList: FilterField[] = []): Observable<void> => {
    this._lastFilter = filterList;
    return new Observable(sub => {
      if (this.lastFilter.length !== 0) {
        this.filterService.filterArray(this.baseItems.items, this._lastFilter).subscribe({
          next: (data) => { this.itemsFiltered.updateItems(data); sub.next() },
          error: (error) => { sub.error(error) }
        });
      } else {
        this.itemsFiltered = this.baseItems;
        sub.next();
      }
    });
  }

  /**Обновить фильтрованные значения */
  resetFilter = (): Observable<void> => {
    return this.filter(this._lastFilter);
  }
}
