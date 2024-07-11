import { Article } from './../../model/Article';
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';

@Injectable({ providedIn: 'root' })
/** Хранилище статей */
export class ArticleRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Получить */
  get = (articleId: number): Observable<Article> => {
    return this.apiClient
      .get<Article>(this.apiService.GetUrl(`Articles/Article/${articleId}`), true)
      .pipe(map((response) => { return Article.Create(response) }));
  }

  /** Добавить */
  add = (item: Article, attachAttachments: number[]): Observable<number> => {
    const url = this.apiService.GetUrl(`Articles/Article`);

    const body = {
      Title: item.Title,
      Content: item.Content,
      AttachAttachments: attachAttachments
    }

    return this.apiClient
      .post(url, JSON.stringify(body), true)
      .pipe(map((response: any) => { return Number(response) }));
  }

  /** Редактировать */
  update = (item: Article, attachAttachments: number[]): Observable<void> => {
    const url = this.apiService.GetUrl(`Articles/Article/${item.Id}`);

    const body = {
      Title: item.Title,
      Content: item.Content,
      AttachAttachments: attachAttachments
    }
    return this.apiClient.patch<void>(url, JSON.stringify(body), true);
  }

  /** Удалить */
  remove = (appealId: number): Observable<void> => {
    const url = this.apiService.GetUrl(`Articles/Article/${appealId}`);
    return this.apiClient.delete<void>(url, true);
  }
}
