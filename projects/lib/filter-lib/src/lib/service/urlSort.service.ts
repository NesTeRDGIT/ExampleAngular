import { SortFieldData } from '../class/SortFieldData';
import { UrlService } from '@shared-lib';
import { Injectable } from "@angular/core";
import { UrlParameter } from '../class/UrlParameter';

/** Сервис для фильтрации */
@Injectable({ providedIn: 'root' })
export class UrlSortService {

  private readonly parameterName = 'order';

  constructor(private urlService: UrlService) { }


  /** Получить UrlParameter сортировки */
  toUrlParameter = (sort: SortFieldData[]): UrlParameter => {
    return new UrlParameter(this.parameterName, sort.map(x => `${x.fieldName} ${x.order == 'Asc' ? 'asc' : 'desc'}`).join(','));
  }

  /** Получить Url параметры сортировки из Url */
  fromUrl = (): SortFieldData[] => {
    const order = this.urlService.getParameter(this.parameterName);
    const result: SortFieldData[] = [];
    order.split(",").forEach(x => {
      const value = x.split(' ');
      if (value.length == 2) {
        result.push(new SortFieldData(value[0], value[1] == 'asc' ? 'Asc' : 'Desc'));
      }
    });
    return result;
  }

   /** Очистить Url */
   clearUrl = () => {
    this.urlService.changeUrlParameter('', this.parameterName);
  }
}
