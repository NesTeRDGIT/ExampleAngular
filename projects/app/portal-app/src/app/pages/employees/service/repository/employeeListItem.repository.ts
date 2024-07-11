import { EmployeeListItem } from '@EmployeeModuleRoot/model/EmployeeListItem';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { FilterField, UrlServerSideService } from '@filter-lib';
import { ApiClientService } from '@authorization-lib';

@Injectable()
export class EmployeeListItemRepository {
  constructor(private apiClient: ApiClientService, private urlServerSideService: UrlServerSideService, private apiService: ApiService) {
  }

  /**Получить список сотрудников */
  get = (filter: FilterField[] = []): Observable<EmployeeListItem[]> => {
    const url = this.urlServerSideService.getUrl(this.apiService.GetUrl(`Employment/EmployeeListItems`), filter);

    return this.apiClient
        .get<EmployeeListItem[]>(url)
        .pipe(map((response) => { return response.map(x => EmployeeListItem.Create(x)) }));
  }
}
