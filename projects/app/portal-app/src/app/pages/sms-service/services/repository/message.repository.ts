import { Message } from '@SmsServiceModuleRoot/model/message/Message';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiService } from "@shared-lib";

@Injectable({ providedIn: 'root' })
/** Хранилище СМС */
export class  MessageRepository {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient, private apiService: ApiService) {

  }

  /** Получить список СМС */
  get = (id: number): Observable<Message> => {
    const url = this.apiService.GetUrl(`SmsService/Message/${id}`);

    return this.http
        .get<Message>(url)
        .pipe(map((response) => { return Message.Create(response)}));
  }
}
