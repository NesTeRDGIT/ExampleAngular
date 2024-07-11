import { Workplace } from '@EmployeeModuleRoot/model/dictionary/Workplace';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';

@Injectable()
export class WorkplaceRepository {
  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Обновить данные места работы */
  update = (workplace: Workplace) : Observable<void> => {
    const employeeModel = {
      Name: workplace.Name,
      ParentId: workplace.ParentId
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Workplace/${workplace.Value}`), JSON.stringify(employeeModel));
  }

  /** Добавить место работы */
  add = (workplace: Workplace): Observable<number> => {
    const employeeModel = {
      Name: workplace.Name,
      ParentId: workplace.ParentId
    };
    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Workplace`), JSON.stringify(employeeModel));
  }

  /** Удалить место работы */
  remove = (workplaceId: number) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Workplace/${workplaceId}`));
  }
}
