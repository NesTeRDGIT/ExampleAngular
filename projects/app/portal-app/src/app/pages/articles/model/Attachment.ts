import { ArgumentNullException, CheckPropertyService, Convert } from "@shared-lib";
import { AttachmentType } from "./AttachmentType";

/** Вложение */
export class Attachment {

  /** Идентификатор */
  Id = 0;

  /** Идентификатор статьи */
  ArticleId = 0;

  /** Тип вложения */
  Type = new AttachmentType();

  /** Наименование */
  Name = "";

  static Create(source: any): Attachment {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new Attachment();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.Id = Convert.ConvertToNumber(source.Id);
    dest.ArticleId = Convert.ConvertToNumber(source.ArticleId);
    dest.Name = Convert.ConvertToString(source.Name);
    dest.Type = AttachmentType.Create(source.Type);
    return dest;
  }
}