import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';
import { Replacement } from '../../model/Replacement';

/** Репозиторий замещаемых должностей */
@Injectable()
export class ReplacementRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Получить */
  get = (employeeId: number): Observable<Replacement[]> => {
    return this.apiClient.get<Replacement[]>(this.apiService.GetUrl(`Employment/Employee/${employeeId}/Replacement`))
      .pipe(map((response:any) => { return response.map((x: any) => Replacement.Create(x)) }));
  }

  /** Добавить */
  add = (item: Replacement): Observable<number> => {
    const model = {
      SubstituteId: item.SubstituteId,
      DateStart: item.DateStart.ToOnlyDateString(),
      DateEnd: item.DateEnd.ToOnlyDateString(),
      AuthorityNumber: item.AuthorityNumber,
      AuthorityDate: item.AuthorityDate.ToOnlyDateString(),
      PostTitle: item.PostTitle,
    };

    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Employee/${item.EmployeeId}/Replacement`), JSON.stringify(model));
  }


  /** Обновить  */
  update = (item: Replacement) : Observable<void> => {
    const model = {
      DateStart: item.DateStart.ToOnlyDateString(),
      DateEnd: item.DateEnd.ToOnlyDateString(),
      AuthorityNumber: item.AuthorityNumber,
      AuthorityDate: item.AuthorityDate.ToOnlyDateString(),
      PostTitle: item.PostTitle,
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Employee/${item.EmployeeId}/Replacement/${item.Id}`), JSON.stringify(model));
  }

  /** Обновить дату закрытия */
  updateDateEnd = (item: Replacement, dateEnd: Date) : Observable<void> => {
    const model = {
      DateEnd: dateEnd.ToOnlyDateString(),
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Employee/${item.EmployeeId}/Replacement/${item.Id}`), JSON.stringify(model));
  }

  /** Удалить отдел */
  remove = (item: Replacement) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Employee/${item.EmployeeId}/Replacement/${item.Id}`));
  }
}
