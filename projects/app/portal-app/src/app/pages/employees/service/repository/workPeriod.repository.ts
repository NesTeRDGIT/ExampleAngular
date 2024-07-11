import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { WorkPeriod } from '@EmployeeModuleRoot/model/WorkPeriod';
import { ApiClientService } from "@authorization-lib";

@Injectable()
export class WorkPeriodRepository {
  constructor(private apiClient: ApiClientService, private apiService: ApiService) {

  }

  /** Получить периоды работы сотрудника */
  get = (employeeId: number): Observable<WorkPeriod[]> => {
    return this.apiClient
      .get<WorkPeriod[]>(this.apiService.GetUrl(`Employment/Employee/${employeeId}/WorkPeriod`))
      .pipe(map((response) => { return response.map(w=> WorkPeriod.Create(w)); }));
  }

  /** Обновить период работы сотрудника */
  update = (workPeriod: WorkPeriod) : Observable<void> => {
    const workPeriodModel = {
      DateStart: workPeriod.DateStart.ToOnlyDateString(),
      DateEnd: workPeriod.DateEnd == null ? null : workPeriod.DateEnd.ToOnlyDateString(),
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Employee/${workPeriod.EmployeeId}/WorkPeriod/${workPeriod.Id}`), JSON.stringify(workPeriodModel));
  }

  /** Добавить период работы сотрудника */
  add = (workPeriod: WorkPeriod): Observable<number> => {
    const employeeModel = {
      DateStart: workPeriod.DateStart.ToOnlyDateString(),
      DateEnd: workPeriod.DateEnd == null ? null : workPeriod.DateEnd.ToOnlyDateString()
    };
    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Employee/${workPeriod.EmployeeId}/WorkPeriod`), JSON.stringify(employeeModel));
  }

  /** Удалить период работы сотрудника */
  remove = (employeeId: number, workPeriodId: number) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Employee/${employeeId}/WorkPeriod/${workPeriodId}`));
  }
}
