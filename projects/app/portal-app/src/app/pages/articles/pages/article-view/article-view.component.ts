import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, OnDestroy, Output, signal, untracked } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { ArticleRepository } from '@ArticlesModuleRoot/services/repository/article.repository';
import { Article } from '@ArticlesModuleRoot/model/Article';
import { Router } from '@angular/router';
import { AttachmentLinkReplaceService } from '@ArticlesModuleRoot/services/attachmentLinkReplace.service';
import { ImgSrcUpdateCallback } from '@components-lib';

@Component({
  selector: 'zms-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleViewComponent implements OnDestroy {

  constructor(
    private articleRepository: ArticleRepository,
    private router: Router,
    private attachmentLinkReplaceService: AttachmentLinkReplaceService,
    private messengerService: MessengerService) {
    effect(() => {
      const articleId = this.articleId();
      if (articleId !== 0) {
        untracked(() => this.load());
      }
    })
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Идентификатор статьи */
  articleId = input(0);

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** Модель */
  model = signal(new Article());

  /** В процессе загрузки */
  loading = signal(false);

  /** Обработчик команды закрытия окна */
  onCloseClick = () : void => {
    this.router.navigate(['articles']);
    this.closed.emit();
  }

  /** Загрузка */
  private load = () : void => {
    const articleId = this.articleId();

    this.loading.set(true);
    this.articleRepository.get(articleId).subscribeWithDestroy({
      next: (item) => {
        this.model.set(item);
        this.loading.set(false);
      },
      error: (e: ProblemDetailApsNet) => {
        this.messengerService.ShowException(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  imgSrcUpdater: ImgSrcUpdateCallback = (srcUrl) => {
    return this.attachmentLinkReplaceService.convertToAbsoluteLink(srcUrl);
  }
}
