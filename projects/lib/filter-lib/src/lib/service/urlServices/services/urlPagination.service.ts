import { Convert, UrlService } from '@shared-lib';
import { Injectable } from "@angular/core";
import { PaginationData } from '../../../class/PaginationData';
import { UrlParameter } from '../../../class/UrlParameter';

/** Сервис преобразования данных пагинации в URL */
@Injectable({ providedIn: 'root' })
export class UrlPaginationService {
  constructor(private urlService: UrlService) { }


  /** Получить UrlParameter[] из параметров пагинации */
  toUrlParameters = (pagination: PaginationData): UrlParameter[] => {
    return [
      new UrlParameter('first', pagination.first.toString()),
      new UrlParameter('count', pagination.rows.toString())];
  }

  /** Получить параметры пагинации из Url  */
  fromUrl(): PaginationData | null {
    const first = Convert.ConvertToNumberOrNull(this.urlService.getParameter('first'));
    const count = Convert.ConvertToNumberOrNull(this.urlService.getParameter('count'));
    return first == null || count == null ? null : new PaginationData(first, count);
  }

  /** Очистить Url */
  clearUrl = () : void => {
    this.urlService.changeUrlParameter('', 'first');
    this.urlService.changeUrlParameter('', 'count');
  }
}
