import { Signal, signal } from "@angular/core";

/** Коллекция элементов */
export class Collection<T = unknown> {

  /** Элементы */
  private _items = signal<T[]>([], { equal: () => false });

  constructor(items: T[] = []) {
    this._items.set(items);
  }

  /** Элементы */
  get items(): Signal<T[]> {
    return this._items;
  }

  /** Обновить коллекцию */
  update = (items: T[]) : void => {
    this._items.set(items);
  }

  /** Модифицировать коллекцию */
  mutate(func: MutateFunction<T>) : void {
    this._items.update(values => {
      func(values);
      return [...values];
    });
  }
}

/** Функция модификации */
export type MutateFunction<T = unknown> = (items: T[]) => void; 