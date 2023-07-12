/** Данные о поле сортировки сортировке  */
export class SortFieldData {

  constructor(fieldName: string, order: 'Asc' | 'Desc'){
    this.fieldName = fieldName;
    this.order = order;
  }

  /** Имя поля */
  fieldName = "";

  /** Порядок сортировки */
  order : 'Asc' | 'Desc' = 'Asc';
}
