

import { ArgumentNullException, CheckPropertyService } from '@shared-lib';

/** Категория */
export class Category {

  /** Код категории */
  Value = "";

  /** Наименование категории */
  Name = "";


  static Create(source: any): Category {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Category();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Value = String(source.Value);
    dest.Name = String(source.Name);
    return dest;
  }
}
