import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Данные о постраничном выводе */
export class Pagination {

  /** Общее количество элементов в исходной коллекции */
  TotalCount = 0;

  static Create(source: any): Pagination {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Pagination();
    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.TotalCount = Convert.ConvertToNumber(source.TotalCount);
    return dest;
  }
}
