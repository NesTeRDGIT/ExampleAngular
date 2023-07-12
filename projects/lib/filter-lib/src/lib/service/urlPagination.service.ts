import { UrlService } from '@shared-lib';
import { Injectable } from "@angular/core";
import { PaginationData } from '../class/PaginationData';
import { UrlParameter } from '../class/UrlParameter';

/** Сервис для фильтрации */
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
    const first = Number(this.urlService.getParameter('first'));
    const count = Number(this.urlService.getParameter('count'));
    return first == 0 && count == 0 ? null : new PaginationData(first, count);
  }

  /** Очистить Url */
  clearUrl = () => {
    this.urlService.changeUrlParameter('', 'first');
    this.urlService.changeUrlParameter('', 'count');
  }
}
