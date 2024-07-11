import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "@shared-lib";
import { Post } from '@EmployeeModuleRoot/model/dictionary/Post';
import { ApiClientService } from "@authorization-lib";

@Injectable()
export class PostRepository {
  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Обновить должность */
  update = (post: Post) : Observable<void> => {
    const model = {
      Name: post.Name,
      ShortName: post.ShortName,
      ChiefPosition: post.ChiefPositionValue,
      Priority: post.Priority,
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Post/${post.Id}`), JSON.stringify(model));
  }

  /** Добавить должность */
  add = (post: Post): Observable<number> => {
    const model = {
      Name: post.Name,
      ShortName: post.ShortName,
      ChiefPosition: post.ChiefPositionValue,
      Priority: post.Priority,
    };
    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Post`), JSON.stringify(model));
  }

  /** Удалить должность */
  remove = (postId: number) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Post/${postId}`));
  }
}
