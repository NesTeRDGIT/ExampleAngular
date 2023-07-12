import { MessageListItemResponse } from '../../model/MessageListItemResponse';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { FilterField, PaginationData, UrlServerSideService } from "@filter-lib";
import { SortFieldData } from 'projects/lib/filter-lib/src/lib/class/SortFieldData';

@Injectable({ providedIn: 'root' })
/** Хранилище СМС */
export class MessageListItemRepository {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient, private apiService: ApiService, private urlServerSideService: UrlServerSideService,) {

  }

  /** Получить список СМС */
  get = (filter: FilterField[] = [], pagination: PaginationData, sort: SortFieldData[]): Observable<MessageListItemResponse> => {
    const url = this.urlServerSideService.getUrl(this.apiService.GetUrl(`SmsService/Message`), filter, pagination, sort);

    return this.http
        .get<MessageListItemResponse>(url)
        .pipe(map((response) => { return MessageListItemResponse.Create(response)}));
  }
}
