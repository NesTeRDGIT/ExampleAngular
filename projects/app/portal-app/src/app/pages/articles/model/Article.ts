import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Статья */
export class Article {

  /** Идентификатор */
  Id = 0;

  /** Дата создания */
  CreatedDate = new Date();

  /** Заголовок */
  Title = "";

  /** Содержимое */
  Content = "";

  static Create(source: any): Article {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Article();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.CreatedDate = Convert.ConvertToDate(source.CreatedDate);
    dest.Title = Convert.ConvertToString(source.Title);
    dest.Content = Convert.ConvertToString(source.Content);
    return dest;
  }
}