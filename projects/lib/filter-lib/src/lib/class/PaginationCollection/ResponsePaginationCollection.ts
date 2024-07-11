import { Metadata } from "./Metadata"

/** Ответ на запрос коллекции с постраничным выводом */
export abstract class ResponsePaginationCollection<T> {

  Init(source: any, initFunction: ((x: any) => T) | null): void {
    this.Data = source.Data.map((x: any) => initFunction ? initFunction(x) : x as T);
    this.Metadata = Metadata.Create(source.Metadata);
  }

  /** Элементы справочника */
  Data: T[] = []

  /** Метаданные */
  Metadata = new Metadata()
}
