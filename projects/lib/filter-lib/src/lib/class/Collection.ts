/** Коллекция элементов */
export class Collection<T>{

  /** Элементы   */
  private _items: T[] = [];

  constructor(items: T[]) {
    this._items = items;
  }

  /** Фильтрованные элементы */
  get items(): T[] {
    return this._items;
  }

  /** Сброс элементов (новый класс массива с теми же элементами) */
  resetItems = () => {
    this._items = [...this._items];
  }

  /** Сбросить элементы(новый набор + сброс фильтров) */
  updateItems = (items: T[]) => {
    this._items = items;
  }
}
