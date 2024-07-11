import { ArticleListItem } from './ArticleListItem';
import { ResponsePaginationCollection } from "@filter-lib";
import { ArgumentNullException, CheckPropertyService } from "@shared-lib";

/** Ответ на запрос получения статей  */
export class ArticleListItemResponse extends ResponsePaginationCollection<ArticleListItem> {


  static Create(source: any): ArticleListItemResponse {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new ArticleListItemResponse();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Init(source, item => ArticleListItem.Create(item));
    return dest;
  }
}
