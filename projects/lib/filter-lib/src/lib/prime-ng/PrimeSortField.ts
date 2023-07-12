/** Поле сортировки */
export interface PrimeSortField {

  /** Наименование поля */
  field: string;

  /** Порядок */
  order: -1 | 0 | 1;
}
