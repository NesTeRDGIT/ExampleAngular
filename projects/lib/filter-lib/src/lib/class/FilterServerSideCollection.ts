import { FilterField } from '../model/FilterField';
import { PaginationData } from './PaginationData';
import { SortFieldData } from './SortFieldData';
import { Collection, MutateFunction } from './Collection';
import { Metadata } from './PaginationCollection/Metadata';
import { Signal, signal } from '@angular/core';

/** Коллекция с фильтром на стороне сервера */
export class FilterServerSideCollection<T = unknown> {
  /** Базовая коллекция */
  private collection = new Collection<T>([]);
  private _filter = signal<FilterField[]>([]);
  private _totalCount = signal(0);
  private _pagination = signal<PaginationData>(new PaginationData(0, 200));
  private _sort = signal<SortFieldData[]>([]);

  constructor(fullItems: T[] = []) {
    this.collection.update(fullItems);
  }

  /** Фильтрованные элементы */
  get items(): Signal<T[]> {
    return this.collection.items;
  }

  /** Последний примененный фильтр */
  get filter(): Signal<FilterField[]> {
    return this._filter;
  }

  /** Количество элементов всего */
  get totalCount(): Signal<number> {
    return this._totalCount;
  }

  /** Данные пагинации */
  get pagination(): Signal<PaginationData> {
    return this._pagination;
  }

  /** Данные о сортировке */
  get sort(): Signal<SortFieldData[]> {
    return this._sort;
  }

  /** Обновить коллекцию
   * @param items - коллекция
   * @param filter - примененные фильтры
   * @param pagination - данные пагинации
   * @param sort - данные сортировки
   * @param Metadata - метаданные коллекции
   */
  update = (items: T[], filter: FilterField[], pagination: PaginationData | null = null, sort: SortFieldData[] = [], metadata: Metadata | number | null = null) : void => {
    this._filter.set(filter);
    this._pagination.set(pagination ?? new PaginationData(0, 200));
    this._sort.set(sort);
    if (typeof metadata == 'number') {
      this._totalCount.set(metadata);
    } else {
      if (metadata && metadata.Pagination) {
        this._totalCount.set(metadata.Pagination.TotalCount);
      }
    }

    this.collection.update(items);
  }

  /** Модифицировать коллекцию */
  mutate = (func: MutateFunction<T>) : void => {
    this.collection.mutate(func);
  }
}