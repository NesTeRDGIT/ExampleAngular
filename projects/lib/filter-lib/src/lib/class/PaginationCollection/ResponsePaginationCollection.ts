import { Metadata } from "./Metadata"

/** Ответ на запрос коллекции с постраничным выводом */
export abstract class ResponsePaginationCollection<T>{

  Init(data: T[], totalCount: number) {
    this.Data = data;
    this.Metadata.Pagination.Count = totalCount;
  }

  /** Элементы справочника */
  Data: T[] = []

  /** Метаданные */
  Metadata = new Metadata()
}
