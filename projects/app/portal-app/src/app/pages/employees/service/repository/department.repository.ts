import { Department } from '@EmployeeModuleRoot/model/dictionary/Department';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';

@Injectable()
export class DepartmentRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Обновить отдел */
  update = (department: Department) : Observable<void> => {
    const model = {
      Name: department.Name,
      ShortName: department.ShortName,
      Priority: department.Priority,
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Department/${department.Id}`), JSON.stringify(model));
  }

  /** Добавить отдел */
  add = (department: Department): Observable<number> => {
    const model = {
      Name: department.Name,
      ShortName: department.ShortName,
      Priority: department.Priority,
    };
    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Department`), JSON.stringify(model));
  }

  /** Удалить отдел */
  remove = (departmentId: number) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Department/${departmentId}`));
  }
}
