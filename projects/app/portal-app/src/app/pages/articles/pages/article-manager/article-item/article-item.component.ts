import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, input, OnDestroy, Output } from '@angular/core';
import { ObservableDestroyer } from '@shared-lib';
import { ArticleListItem } from '@ArticlesModuleRoot/model/ArticleListItem';
import { ImgSrcUpdateCallback } from '@components-lib';
import { AttachmentLinkReplaceService } from '@ArticlesModuleRoot/services/attachmentLinkReplace.service';

@Component({
  selector: 'zms-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleItemComponent implements OnDestroy {

  constructor(private attachmentLinkReplaceService: AttachmentLinkReplaceService){}

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }


  /** Статья */
  article = input(new ArticleListItem());

  /** Только для чтения */
  readonly = input(true);

  /** События просмотра */
  @Output() view = new EventEmitter<ArticleListItem>();
  @HostListener('click', ['$event']) onClick(e: PointerEvent) : void {
    e.stopPropagation();
    this.view.emit(this.article());
  }

  /** События клика на кнопку редактирования */
  @Output() editClick = new EventEmitter<ArticleListItem>();
  onEdit = (e: MouseEvent) : void => {
    e.stopPropagation();
    this.editClick.emit(this.article());
  }

  /** События клика на кнопку удаления */
  @Output() deleteClick = new EventEmitter<ArticleListItem>();
  onDelete = (e: MouseEvent) : void => {
    e.stopPropagation();
    this.deleteClick.emit(this.article());
  }


  imgSrcUpdater: ImgSrcUpdateCallback = (srcUrl) => {
    return this.attachmentLinkReplaceService.convertToAbsoluteLink(srcUrl);
  }
}
