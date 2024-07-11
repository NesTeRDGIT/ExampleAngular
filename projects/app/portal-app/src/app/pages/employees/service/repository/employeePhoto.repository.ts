import { EmployeePhoto } from '@EmployeeModuleRoot/model/EmployeePhoto';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';
import { LoadState, FileLoadService } from '@download-lib';

@Injectable()
export class EmployeePhotoRepository {
  constructor(
    private ApiClientService: ApiClientService,
    private fileLoadService: FileLoadService,
    private apiService: ApiService) {

  }

  /**Получить фотографии сотрудника */
  get = (employeeId: number): Observable<EmployeePhoto[]> => {
    return this.ApiClientService
      .get<EmployeePhoto[]>(this.apiService.GetUrl(`Employment/Employee/${employeeId}/Photos`), false)
      .pipe(map((response) => { return response.map(x => EmployeePhoto.Create(x)); }));
  }

   /** Получить Url фотографии */
   getUrlImageById = (photoId: number): string => {
    return this.apiService.GetUrl(`Employment/Photo/${photoId}`);
  }

    /** Получить Url миниатюры фотографии */
   getUrlThumbnailImageById = (photoId: number): string => {
    return this.apiService.GetUrl(`Employment/Photo/${photoId}/Thumbnail`);
  }


  /** Добавить фотографию */
  add = (employeeId: number, file: File): Observable<LoadState> => {
    return this.fileLoadService.uploadFile(this.apiService.GetUrl(`Employment/Employee/${employeeId}/Photos`), file);
  }

  /** Удалить фотографию */
  remove = (photo: EmployeePhoto) : Observable<void> => {
    return this.ApiClientService
      .delete(this.apiService.GetUrl(`Employment/Employee/${photo.EmployeeId}/Photos/${photo.Id}`));
  }
}
