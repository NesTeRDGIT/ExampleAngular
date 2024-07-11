import { ArgumentNullException, CheckPropertyService } from "@shared-lib";
import { Pagination } from "./Pagination";

/** Метаданные */
export class Metadata {

  /** Данные о постраничном выводе */
  Pagination: Pagination | null = null;

  static Create(source: any): Metadata {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Metadata();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Pagination = source.Pagination == null ? null : Pagination.Create(source.Pagination);
    return dest;
  }
}
