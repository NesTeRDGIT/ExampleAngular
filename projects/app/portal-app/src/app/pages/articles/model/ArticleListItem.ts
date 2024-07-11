import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";

/** Статья */
export class ArticleListItem {

  /** Идентификатор */
  Id = 0;

  /** Дата создания */
  CreatedDate = new Date();

  /** Заголовок */
  Title = "";

  /** Часть содержимого */
  ContentPart = "";

  /** Количество вложений */
  AttachmentCount = 0;

  static Create(source: any): ArticleListItem {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new ArticleListItem();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.CreatedDate = Convert.ConvertToDate(source.CreatedDate);
    dest.Title = Convert.ConvertToString(source.Title);
    dest.ContentPart = Convert.ConvertToString(source.ContentPart);
    dest.AttachmentCount = Convert.ConvertToNumber(source.AttachmentCount);
    return dest;
  }
}