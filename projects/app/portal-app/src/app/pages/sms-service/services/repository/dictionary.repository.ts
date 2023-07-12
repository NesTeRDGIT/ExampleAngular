
import { ApiService } from "@shared-lib";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";

import { Category } from '../../model/dictionary/Category';
import { Status } from "../../model/dictionary/Status";

@Injectable()
export class DictionaryRepository {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  /** Получить статусы */
  getCategory = (): Observable<Category[]> => {
    return this.http
      .get<Category[]>(this.apiService.GetUrl(`SmsService/Thesaurus/Category`))
      .pipe(map((response) => { return response.map(x => Category.Create(x)) }));
  }

  /** Получить категории */
  getStatus = (): Observable<Status[]> => {
    return this.http
      .get<Status[]>(this.apiService.GetUrl(`SmsService/Thesaurus/Status`))
      .pipe(map((response) => { return response.map(x => Status.Create(x)) }));
  }
}
