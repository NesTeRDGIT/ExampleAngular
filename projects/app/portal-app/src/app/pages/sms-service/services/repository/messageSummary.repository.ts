import { Summary } from '@SmsServiceModuleRoot/model/Summary';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";
import { FilterField, UrlServerSideService } from "@filter-lib";

@Injectable({ providedIn: 'root' })
/** Хранилище кратких данных о сообщениях */
export class MessageSummaryRepository {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient, private apiService: ApiService, private urlServerSideService: UrlServerSideService,) {

  }

  /** Получить  */
  get = (filter: FilterField[] = []): Observable<Summary> => {
    const url = this.urlServerSideService.getUrl(this.apiService.GetUrl(`SmsService/Message/Summary`), filter, null, []);
    return this.http
        .get(url)
        .pipe(map((response:any) => { return Summary.Create(response.Summary)}));
  }
}
