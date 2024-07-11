import { signal } from '@angular/core';
import { ArticlesStore } from './../../store/store';
import { AfterContentInit, Component, OnDestroy, ViewChild, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MessengerService, success, ObservableDestroyer, ComponentVisible } from '@shared-lib';
import { FilterEvent, FilterField, BrowserQueryStringService, PaginationData, SortFieldData } from '@filter-lib'
import { PageChangeEvent, PaginatorComponent } from '@components-lib';
import { ArticleListItem } from '@ArticlesModuleRoot/model/ArticleListItem';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authenticatedFeature } from '@authorization-lib';
import { LoadState } from '@download-lib';
import { AttachmentRepository } from '@ArticlesModuleRoot/services/repository/attachment.repository';

@Component({
  selector: 'zms-article-manager',
  templateUrl: './article-manager.component.html',
  styleUrls: ['./article-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleManagerComponent implements AfterContentInit, OnDestroy {

  @ViewChild("Paginator") Paginator?: PaginatorComponent;

  constructor(
    private router: Router,
    private messengerService: MessengerService,
    private attachmentRepository: AttachmentRepository,
    private BrowserQueryStringService: BrowserQueryStringService,
    private store$: Store) {
  }

  ngAfterContentInit(): void {
    if (!this.store.isInit()) {
      this.load(this.store.articles().filter(), this.store.articles().pagination(), this.defaultSort, true);
    } else {
      const selected = this.store.selectArticle();
      if (selected) {
        this.store.setSelect(null);
        /** Прокрутить до выбранного элемента */
        setTimeout(() => {
          const element = document.getElementById(this.getHtmlId(selected));
          element?.scrollIntoView()
        }, 0);
      }
    }
  }

  /** Получить идентификатор */
  getHtmlId = (item: ArticleListItem) : string => {
    return `articleItem${item.Id}`;
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();

    const url = this.router.url.split('?')[0];
    if (!url.startsWith('/articles')) {
      this.store.reset();
    }
  }

  readonly store = inject(ArticlesStore);

  /** Профиль пользователя */
  userProfile = this.store$.selectSignal(authenticatedFeature.articleProfile);

  /** Может ли редактировать */
  canEdit = computed(() => this.userProfile().Writer || this.userProfile().Admin);

  /** Может ли Prune */
  canPrune = computed(() => this.userProfile().Admin);

  /** Отображение статьи */
  articleVisible = new ComponentVisible<IArticleViewValue>({ id: 0, mode: 'view' });

  /** Создание статьи */
  onCreateClick = () : void => {
    this.articleVisible.show({ id: 0, mode: 'edit'});
  }

  /** Редактирование статьи */
  onEditClick = (article: ArticleListItem) : void => {
    this.articleVisible.show({id: article.Id, mode: 'edit'});
  }

  /** Просмотр статьи */
  onViewClick = (article: ArticleListItem) : void => {
    this.store.setSelect(article);
    this.router.navigate(['articles', `${article.Id}`]);
  }

  /** Обработчик события закрытие отображение справочника */
  onCloseArticle = () : void => {
    this.articleVisible.hide();
  }

  /** Удаление */
  onDeleteClick = (items: ArticleListItem[]) : void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: () => {
        const uniqueId = [...new Set(items.map(x => x.Id))];
        this.store.removeArticlesItem(uniqueId).subscribeWithDestroy({
          next: () => this.messengerService.ShowSuccess(`${items.length} статей удалено`),
          error: e => this.messengerService.ShowException(e)
        }, this.destroyer$);
      }
    }, this.destroyer$);
  }

  pruneState = signal(LoadState.Default());
  onPruneClick = () : void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить вложения?`).pipe(success()).subscribeWithDestroy({
      next: () => {
        this.pruneState.set(LoadState.Pending());
        this.attachmentRepository.prune().subscribeWithDestroy({
          next: (count) => {
            this.messengerService.ShowSuccess(`Удалено ${count} вложений`);
            this.pruneState.set(LoadState.Default());
          },
          error: e => {
            this.messengerService.ShowException(e);
            this.pruneState.set(LoadState.Default());
          }
        }, this.destroyer$);
      }
    }, this.destroyer$);
  }

  /** Условия сортировки по умолчанию */
  private readonly defaultSort = [new SortFieldData('CreatedDate', 'Desc')];

  /** Обработчик события фильтрации */
  onFilter = (e: FilterEvent) : void => {
    if (this.Paginator) {
      const rows = this.Paginator.rows();
      this.load(e.fields, new PaginationData(0, rows), this.defaultSort, true);
    }
  }

  /** Обработчик события изменения страницы */
  onPageChange = (e: PageChangeEvent) : void => {
    if (e.first != undefined && e.rows != undefined) {
      this.load(this.store.articles().filter(), new PaginationData(e.first, e.rows), this.defaultSort, true);
    }
  }

  /** Загрузка */
  private load = (filter: FilterField[], pagination: PaginationData, sort: SortFieldData[], metadata: boolean, fixUrl = true) : void => {
    this.store.loadArticles(filter, pagination, sort, metadata).subscribeWithDestroy({
      next: (articles) => {
        if (fixUrl) {
          this.BrowserQueryStringService.writeToUrl(articles);
        }
      },
      error: (e) => this.messengerService.ShowException(e)
    }, this.destroyer$);
  }

  /** Частичная загрузка данных */
  private loadPart = (articleId: number) : void => {
    this.store.updateArticlesItem(articleId).subscribeWithDestroy({
      error: (e) => this.messengerService.ShowException(e)
    }, this.destroyer$);
  }

  /** Обработчик события изменение статьи */
  onChanged = (articleId: number) : void => {
    this.loadPart(articleId);
  }
}


interface IArticleViewValue {
  /** Идентификатор */
  id: number,

  /** Режим */
  mode: 'view' | 'edit'
}