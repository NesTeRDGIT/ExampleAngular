import { ArticleListItemResponse } from './../../model/ArticleListItemResponse';
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "@shared-lib";
import { FilterField, PaginationData, SortFieldData, UrlServerSideService } from '@filter-lib';
import { ApiClientService } from '@authorization-lib';

@Injectable({ providedIn: 'root' })
/** Хранилище статей */
export class ArticleListItemRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService, private urlServerSideService: UrlServerSideService) {
  }

  /** Получить */
  get = (filter: FilterField[] = [], pagination: PaginationData | null, sort: SortFieldData[], metadata: boolean): Observable<ArticleListItemResponse> => {
    const url = this.urlServerSideService.getUrl(this.apiService.GetUrl(`Articles/ArticleList`), filter, pagination, sort, metadata);

    return this.apiClient
      .get<ArticleListItemResponse>(url)
      .pipe(map((response) => { return ArticleListItemResponse.Create(response) }));
  }
}
