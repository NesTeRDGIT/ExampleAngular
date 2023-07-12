import { ResponsePaginationCollection } from "@filter-lib";
import { MessageListItem } from "./MessageListItem";
import { ArgumentNullException, CheckPropertyService } from "@shared-lib";

/** Ответ на запрос получения СМС  */
export class MessageListItemResponse extends ResponsePaginationCollection<MessageListItem> {


  static Create(source: any): MessageListItemResponse {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new MessageListItemResponse();
    const errField = CheckPropertyService.CheckProperty(dest, source);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Init(source.Data.map((x: any) => MessageListItem.Create(x)), Number(source.Metadata.Pagination.Count));
    return dest;
  }
}
