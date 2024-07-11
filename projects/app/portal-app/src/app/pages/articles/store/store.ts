import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ArticleListItem } from '../model/ArticleListItem';
import { ArticleListItemRepository } from '@ArticlesModuleRoot/services/repository/articleListItem.repository';
import { FilterField, FilterServerSideCollection, PaginationData, SortFieldData, TypeComparer } from '@filter-lib';
import { Observable, concatMap, from } from 'rxjs';
import { ArrayHelper } from '@shared-lib';
import { ArticleRepository } from '@ArticlesModuleRoot/services/repository/article.repository';

/** Состояние */
interface ArticlesState {
    articles: FilterServerSideCollection<ArticleListItem>;
    isInit: boolean;
    loading: boolean;
    selectArticle: ArticleListItem | null
}

/** Начальное состояние */
const initialState: ArticlesState = {
    /** Статьи */
    articles: new FilterServerSideCollection<ArticleListItem>([]),
    /** Признак инициализации */
    isInit: false,
    /** В процессе загрузки */
    loading: false,
    /** Выбранная статья */
    selectArticle: null
};

/** Хранилище состояния */
export const ArticlesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    /** Методы */
    withMethods((store, articleListItemRepository = inject(ArticleListItemRepository), articleRepository = inject(ArticleRepository)) => ({

        /** Загрузить */
        loadArticles(filter: FilterField[] = [], pagination: PaginationData | null, sort: SortFieldData[], metadata: boolean): Observable<FilterServerSideCollection<ArticleListItem>> {
            return new Observable(sub => {
                patchState(store, { loading: true });
                articleListItemRepository.get(filter, pagination, sort, metadata).subscribe({
                    next: (response) => {
                        store.articles().update(response.Data, filter, pagination, sort, response.Metadata);
                        patchState(store, { loading: false, isInit: true });
                        sub.next(store.articles());
                        sub.complete();
                    },
                    error: (e) => {
                        patchState(store, { loading: false });
                        sub.error(e);
                    }
                })
            });
        },

        /** Обновить элемент */
        updateArticlesItem(articleId: number): Observable<void> {
            return new Observable(sub => {
                const filterField = FilterField.CreateDefault("Id", TypeComparer.equals);
                filterField.value = articleId;

                articleListItemRepository.get([filterField], null, [], false).subscribe({
                    next: (data) => {
                        store.articles().mutate(articles=> ArrayHelper.replaceByKey<ArticleListItem>(articles, data.Data, x => x.Id));
                        sub.next();
                        sub.complete();
                    },
                    error: (e) => {
                        sub.error(e);
                    }
                });
            }
            )
        },

        /** Удалить статью */
        removeArticlesItem(ids: number[]): Observable<void> {
            return new Observable(sub => {
                const uniqueId = [...new Set(ids.map(x => x))];
                patchState(store, { loading: true });

                from(uniqueId).pipe(
                    concatMap(articleId => articleRepository.remove(articleId))
                ).subscribe({
                    next: () => {
                        store.articles().mutate(articles => ArrayHelper.removeByKey(articles, uniqueId, x => x.Id));
                        patchState(store, { loading: false });
                        sub.next();
                        sub.complete();
                    },
                    error: e => {
                        patchState(store, { loading: false });
                        sub.error(e)
                    }
                });
            });
        },

        /** Установить текуще значение */
        setSelect(item: ArticleListItem | null) : void {
            patchState(store, { selectArticle: item });
        },

        /** Сброс хранилища */
        reset() : void {
            patchState(store, initialState);
        }

    }))
);