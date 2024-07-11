/** Данные о поле сортировки  */
export class SortFieldData {

  constructor(fieldName: string, order: OrderType){
    this.fieldName = fieldName;
    this.order = order;
  }

  /** Имя поля */
  fieldName = "";

  /** Порядок сортировки */
  order : OrderType = 'Asc';
}

/** Типы сортировки */
export type OrderType = 'Asc' | 'Desc';
