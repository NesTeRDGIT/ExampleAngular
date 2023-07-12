import { SortFieldData } from '../class/SortFieldData';
import { InvalidCastException, UrlService } from '@shared-lib';
import { Injectable } from "@angular/core";
import { FilterField } from "../model/FilterField";
import { TypeComparer } from "../model/TypeComparer";
import { FieldInfo } from "../model/FieldInfo";
import { PaginationData } from '../class/PaginationData';
import { UrlParameter } from '../class/UrlParameter';
import { UrlPaginationService } from './urlPagination.service';
import { UrlSortService } from './urlSort.service';
import { UrlFilterService } from './urlFilter.service';

/** Сервис для фильтрации */
@Injectable({ providedIn: 'root' })
export class UrlServerSideService {

 

  constructor(
    private urlService: UrlService,
    private urlFilterService: UrlFilterService,
    private urlPaginationService: UrlPaginationService,
    private urlSortService: UrlSortService
    ) { }

  /** Получить Url из набора фильтров
   * @param filterList  - Список фильтров
   * @param baseAddress - Адрес хоста
   * @param nameParameter - Имя параметра для стандартных фильтров
  */
  getUrl = (baseAddress: string, filterList: FilterField[] = [], pagination: PaginationData | null = null, sort: SortFieldData[] = []) : string => {

    const urlParameters = this.urlFilterService.toUrlParameters(filterList);

    if(pagination != null){
      urlParameters.push(...this.urlPaginationService.toUrlParameters(pagination));
    }

    if(sort.length !== 0){
      urlParameters.push(this.urlSortService.toUrlParameter(sort));
    }

    if (urlParameters.length !== 0) {
      return `${baseAddress}?${urlParameters.map(x => `${x.name}=${x.value}`).join('&')}`;
    } else {
      return baseAddress;
    }
  }

  /** Получить параметры из Url */
  getParameterFromUrl = ():{ filter: FieldInfo[], pagination: PaginationData | null, sort: SortFieldData[] }=>{
    const filter = this.urlFilterService.fromUrl();
    const pagination = this.urlPaginationService.fromUrl();
    const sort = this.urlSortService.fromUrl();

    return {
      filter: filter,
      pagination: pagination,
      sort: sort
    }
  }
}
