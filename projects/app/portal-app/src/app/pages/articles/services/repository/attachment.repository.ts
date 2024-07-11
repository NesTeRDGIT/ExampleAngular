import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService, Convert } from "@shared-lib";
import { FileLoadService, LoadState, ProgressFunc } from "@download-lib";
import { Attachment } from "../../model/Attachment";
import { ApiClientService } from "@authorization-lib";

@Injectable({ providedIn: 'root' })
/** Хранилище вложений */
export class AttachmentRepository {

  constructor(private apiClient: ApiClientService, private fileLoadService: FileLoadService, private apiService: ApiService) {
  }

  /** Получить  */
  get = (articleId: number): Observable<Attachment[]> => {
    return this.apiClient.get(this.apiService.GetUrl(`Articles/Article/${articleId}/Attachment`))
      .pipe(map((response: any) => response.map((x: any) => Attachment.Create(x))));
  }

  /** Получить данные вложения  */
  getData = (attachment: Attachment, progress?: ProgressFunc): Observable<Blob> => {
    return this.fileLoadService.getDataByGet(this.getUrl(attachment.Id), progress);
  }

  /** Получить Url вложения */
  getUrl = (attachmentId: number) : string =>{
    return this.apiService.GetUrl(`Articles/Attachment/${attachmentId}/Data`);
  }

  /** Загрузить вложение  */
  download = (attachment: Attachment): Observable<LoadState> => {
    return this.fileLoadService.downloadFileByGet(this.apiService.GetUrl(`Articles/Attachment/${attachment.Id}/Download`));
  }

  /** Добавить  */
  add = (articleId: number | null, file: File): Observable<LoadState<number>> => {
    if(articleId != null){
      return this.fileLoadService.uploadFile(this.apiService.GetUrl(`Articles/Article/${articleId}/Attachment`), file);
    } else {
      return this.fileLoadService.uploadFile(this.apiService.GetUrl(`Articles/Attachment`), file);
    }
  }

  /** Удалить  */
  remove = (item: Attachment) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Articles/Attachment/${item.Id}`));
  }

  /** Удалить вложения не прикрепленные к статьям  */
  prune = ():Observable<number> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Articles/Attachment/prune`))
      .pipe(map((response: any) => Convert.ConvertToNumber(response)));
  }
}
