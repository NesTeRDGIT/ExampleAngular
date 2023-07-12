import { TableLazyLoadEvent } from "primeng/table";


/** Данные о страничном режиме */
export class PaginationData {

  constructor(first: number, rows: number){
    this.first = first;
    this.rows = rows;
  }

  /** Первый элемент */
  first = 0;

  /** Количество элементов */
  rows = 0;

  /** Создать PaginationData из TableLazyLoadEvent */
  static Create = (event : TableLazyLoadEvent): PaginationData =>{
    return new PaginationData(event.first ?? 0, event.rows ?? 0);
  }
}
