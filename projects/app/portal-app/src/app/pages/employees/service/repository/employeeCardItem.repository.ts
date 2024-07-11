import { EmployeeCardItem } from '@EmployeeModuleRoot/model/EmployeeCardItem';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { FilterField, UrlServerSideService } from '@filter-lib';
import { ApiClientService } from '@authorization-lib';

@Injectable()
export class EmployeeCardItemRepository {

  constructor(private apiClient: ApiClientService, private urlServerSideService: UrlServerSideService, private apiService: ApiService) {
  }

  /**Получить список сотрудников */
  get = (filter: FilterField[] = []): Observable<EmployeeCardItem[]> => {
    const url = this.urlServerSideService.getUrl(this.apiService.GetUrl(`Employment/EmployeeCardItems`), filter);

    return this.apiClient
        .get<EmployeeCardItem[]>(url, false)
        .pipe(map((response) => { return response.map(x => EmployeeCardItem.Create(x)) }));
  }
}
