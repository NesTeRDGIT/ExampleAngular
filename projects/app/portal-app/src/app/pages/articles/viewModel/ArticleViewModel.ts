import { IConvertible, ValidationField, ValidationModelBase, isEmpty } from "@shared-lib";
import { Article } from "../model/Article";
import { AttachmentLinkReplaceService } from '@ArticlesModuleRoot/services/attachmentLinkReplace.service';

/** Статья */
export class ArticleViewModel extends ValidationModelBase<ArticleViewModel> implements IConvertible<Article> {

  constructor() {
    super();
    this.addValidatorForField(this.Title, v => !isEmpty(v.Title.Value), "Заголовок обязателен к заполнению");
    this.addValidatorForField(this.Content, v => !isEmpty(v.Content.Value), "Содержимое обязательно к заполнению");
  }

  /** Идентификатор */
  Id = 0;

  /** Заголовок */
  Title = new ValidationField("");

  /** Содержимое */
  Content = new ValidationField("");

  update(source: Article, attachmentLinkReplaceService: AttachmentLinkReplaceService): void {
    this.Id = source.Id;
    this.Title.Value = source.Title;
    this.Content.Value = attachmentLinkReplaceService.convertDocumentToAbsoluteLink(source.Content);;
    this.SetUntouched();
  }

  convert(attachmentLinkReplaceService: AttachmentLinkReplaceService): Article {
    const dest = new Article();
    dest.Id = this.Id;
    dest.Title = this.Title.Value;
    dest.Content = attachmentLinkReplaceService.convertDocumentToRelativeLink(this.Content.Value);
    return dest;
  }
}