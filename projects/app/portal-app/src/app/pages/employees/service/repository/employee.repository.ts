import { Employee } from '@EmployeeModuleRoot/model/Employee';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { ApiClientService } from '@authorization-lib';

@Injectable()
export class EmployeeRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService) {

  }

  /**Получить сотрудника */
  get = (employeeId: number): Observable<Employee> => {
    return this.apiClient
      .get<Employee>(this.apiService.GetUrl(`Employment/Employee/${employeeId}`))
      .pipe(map((response) => { return Employee.Create(response); }));
  }

  /** Обновить данные сотрудника */
  update = (employee: Employee) : Observable<void> => {
    const employeeModel = {
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      MiddleName: employee.MiddleName,
      Sex: employee.Sex,
      Birthday: employee.Birthday?.ToOnlyDateString(),
      Email: employee.Email,
      Phone: employee.Phone,
      InternalPhone: employee.InternalPhone,
      Department: employee.Department,
      Post: employee.Post,
      Workplace: employee.WorkplaceValue
    };
    return this.apiClient
      .patch(this.apiService.GetUrl(`Employment/Employee/${employee.Id}`), JSON.stringify(employeeModel));
  }

  /** Добавить сотрудника */
  add = (employee: Employee, DateStart: Date, DateEnd: Date | null): Observable<number> => {
    const employeeModel = {
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      MiddleName: employee.MiddleName,
      Sex: employee.Sex,
      Birthday: employee.Birthday?.ToOnlyDateString(),
      Email: employee.Email,
      Phone: employee.Phone,
      InternalPhone: employee.InternalPhone,
      Department: employee.Department,
      Post: employee.Post,
      Workplace: employee.WorkplaceValue,
      DateStart: DateStart.ToOnlyDateString(),
      DateEnd: DateEnd?.ToOnlyDateString()
    };
    return this.apiClient
      .post<number>(this.apiService.GetUrl(`Employment/Employee`), JSON.stringify(employeeModel));
  }

  /** Удалить сотрудника */
  remove = (employeeId: number) : Observable<void> => {
    return this.apiClient
      .delete(this.apiService.GetUrl(`Employment/Employee/${employeeId}`));
  }
}
