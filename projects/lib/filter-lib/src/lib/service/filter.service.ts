import { Injectable } from "@angular/core";
import { FilterField } from "../model/FilterField";
import { TypeComparer } from "../model/TypeComparer";
import { Observable } from "rxjs";

/** Сервис для фильтрации в памяти */
@Injectable({ providedIn: 'root' })
export class FilterService {

  /** Фильтрация массива под фильтры */
  filterArray<T>(items: T[], filterFields: FilterField[]): Observable<T[]> {
    const observable = new Observable<T[]>((subscriber) => {

      const fields = filterFields.filter(x => x.hasValue);
      if (fields.length === 0) {
        subscriber.next(items);
        return;
      }
      subscriber.next(items.filter(x => this.filterItem(x, fields)));
    });
    return observable;
  }

  /** Подходит ли значение под фильтры */
  filterItem(item: unknown, filterFields: FilterField[]): boolean {
    for (const filter of filterFields) {
      const values = filter.field.map(x => this.getValue(item, x));
      let result = false;
      for (const value of values) {
        if (this.compareValue(value, filter)) {
          result = true;
          break;
        }
      }
      if (!result)
        return false;
    }
    return true;
  }

  /** Получить значение по наименованию */
  private getValue(item: any, prop: string): unknown {
    return item[prop];
  }

  /** Сравнить значение с фильтром */
  private compareValue = (value: unknown, filter: FilterField): boolean => {
    switch (filter.typeComparer) {
      case TypeComparer.after: return this.comparer[TypeComparer.after](value, filter.singleValue);
      case TypeComparer.before: return this.comparer[TypeComparer.before](value, filter.singleValue);
      case TypeComparer.between: return this.comparer[TypeComparer.between](value, filter.arrayValue);
      case TypeComparer.contains: return this.comparer[TypeComparer.contains](value, filter.singleValue);
      case TypeComparer.dateAfter: return this.comparer[TypeComparer.dateAfter](value, filter.singleValue);
      case TypeComparer.dateBefore: return this.comparer[TypeComparer.dateBefore](value, filter.singleValue);
      case TypeComparer.dateIs: return this.comparer[TypeComparer.dateIs](value, filter.singleValue);
      case TypeComparer.dateIsNot: return this.comparer[TypeComparer.dateIsNot](value, filter.singleValue);
      case TypeComparer.endsWith: return this.comparer[TypeComparer.endsWith](value, filter.singleValue);
      case TypeComparer.equals: return this.comparer[TypeComparer.equals](value, filter.singleValue);
      case TypeComparer.gt: return this.comparer[TypeComparer.gt](value, filter.singleValue);
      case TypeComparer.gte: return this.comparer[TypeComparer.gte](value, filter.singleValue);
      case TypeComparer.in: return this.comparer[TypeComparer.in](value, filter.arrayValue);
      case TypeComparer.is: return this.comparer[TypeComparer.is](value, filter.value);
      case TypeComparer.isNot: return this.comparer[TypeComparer.isNot](value, filter.value);
      case TypeComparer.lt: return this.comparer[TypeComparer.lt](value, filter.value);
      case TypeComparer.lte: return this.comparer[TypeComparer.lte](value, filter.value);
      case TypeComparer.notContains: return this.comparer[TypeComparer.notContains](value, filter.value);
      case TypeComparer.notEquals: return this.comparer[TypeComparer.notEquals](value, filter.value);
      case TypeComparer.startsWith: return this.comparer[TypeComparer.startsWith](value, filter.value);
      default:
        return false;
    }
  }

  /** Сравнения */
  private comparer = {
    startsWith: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLocaleLowerCase();
      const stringValue = value.toString().toLocaleLowerCase();
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLocaleLowerCase();
      const stringValue = value.toString().toLocaleLowerCase();

      return stringValue.includes(filterValue);
    },

    notContains: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLocaleLowerCase();
      const stringValue = value.toString().toLocaleLowerCase();

      return !stringValue.includes(filterValue);
    },

    endsWith: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLocaleLowerCase();
      const stringValue = value.toString().toLocaleLowerCase();

      return stringValue.includes(filterValue, stringValue.length - filterValue.length);
    },

    equals: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() === filter.getTime();
      }
      else {
        const filterValue = filter.toString().toLocaleLowerCase();
        const stringValue = value.toString().toLocaleLowerCase();
        return filterValue == stringValue;
      }
    },

    notEquals: (value: unknown, filter: unknown): boolean => {
      return !this.comparer.equals(value, filter);
    },

    in: (value: unknown, filter: unknown[]): boolean => {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < filter.length; i++) {
        if (value == filter[i]) {
          return true;
        }
      }

      return false;
    },

    between: (value: unknown, filter: unknown[]): boolean => {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }

      const filterStart = filter[0];
      const filterEnd = filter[1];


      if (value instanceof Date && filterStart instanceof Date && filterEnd instanceof Date) {
        return filterStart.getTime() <= value.getTime() && value.getTime() <= filterEnd.getTime();
      }
      return filterStart <= value && value <= filterEnd;
    },

    lt: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() < filter.getTime();
      }
      return value < filter;
    },

    lte: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() <= filter.getTime();
      }
      return value <= filter;
    },

    gt: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() > filter.getTime();
      }
      return value > filter;
    },

    gte: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() >= filter.getTime();
      }
      return value >= filter;
    },

    is: (value: unknown, filter: unknown): boolean => {
      return this.comparer.equals(value, filter);
    },

    isNot: (value: unknown, filter: unknown): boolean => {
      return this.comparer.notEquals(value, filter);
    },

    before: (value: unknown, filter: unknown): boolean => {
      return this.comparer.lt(value, filter);
    },

    after: (value: unknown, filter: unknown): boolean => {
      return this.comparer.gt(value, filter);
    },

    dateIs: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.toDateString() === filter.toDateString();
      }
      return false;
    },

    dateIsNot: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.toDateString() !== filter.toDateString();
      }
      return false;
    },

    dateBefore: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() < filter.getTime();
      }
      return false;
    },

    dateAfter: (value: unknown, filter: unknown): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (value instanceof Date && filter instanceof Date) {
        return value.getTime() > filter.getTime();
      }
      return false;
    }
  }
}
