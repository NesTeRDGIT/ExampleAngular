import { UrlService } from "@shared-lib";
import { FilterServerSideCollection } from "../class/FilterServerSideCollection";
import { FieldInfo } from "../model/FieldInfo";
import { UrlFilterService } from "./urlServices/services/urlFilter.service";
import { Injectable } from "@angular/core";
import { SortFieldData } from "../class/SortFieldData";
import { UrlSortService } from "./urlServices/services/urlSort.service";
import { PaginationData } from "../class/PaginationData";
import { UrlPaginationService } from "./urlServices/services/urlPagination.service";
import { UrlParameter } from "../class/UrlParameter";
import { QueryParameters } from "../class/QueryParameters";

/** Сервис для отражения метаданных коллекции с фильтрацией на стороне сервера в строке запроса браузера */
@Injectable({ providedIn: 'root' })
export class BrowserQueryStringService {

  constructor(
    private urlService: UrlService,
    private urlFilterService: UrlFilterService,
    private urlSortService: UrlSortService,
    private urlPaginationService: UrlPaginationService,
  ) {

  }

  /** Записать данные в строку запроса браузера */
  writeToUrl = <T>(collection: FilterServerSideCollection<T>) : void => {

    const filter = collection.filter();
    const pagination = collection.pagination();
    const sort = collection.sort();

    const urlParameters: UrlParameter[] = [];
    this.clearUrl();

    if (filter.length !== 0) {
      urlParameters.push(...this.urlFilterService.toUrlParameters(filter));
    } else {
      this.urlFilterService.clearUrl();
    }


    if (pagination != null) {
      urlParameters.push(...this.urlPaginationService.toUrlParameters(pagination));
    } else {
      this.urlPaginationService.clearUrl();
    }

    if (sort.length !== 0) {
      urlParameters.push(this.urlSortService.toUrlParameter(sort));
    } else {
      this.urlSortService.clearUrl();
    }

    urlParameters.forEach(parameter => {
      this.urlService.changeUrlParameter(parameter.value, parameter.name);
    });
  }

  /** Очистить данные в строке запроса браузера */
  clearUrl = () : void => {
    this.urlFilterService.clearUrl();
    this.urlPaginationService.clearUrl();
    this.urlSortService.clearUrl();
  }

  /** Прочитать параметры из строки запроса браузера
   * @param singleUrlName - отдельные параметры фильтра(добавятся в фильтр)
   */
  readFromUrl = (singleUrlName: string[] = []): QueryParameters => {
    const sort = this.readSortFromUrl();
    const pagination = this.readPaginationFromUrl();
    const defaultFilterInfo = this.readFilterFromUrl(singleUrlName);
    return {
      filter: defaultFilterInfo,
      pagination: pagination,
      sort: sort
    }
  };

  /** Прочитать данные фильтра из строки запроса браузера */
  private readFilterFromUrl = (singleUrlName: string[] = []): FieldInfo[] => {
    const singleUrlParameter = this.urlService.getParameters().filter(x => singleUrlName.find(n => n == x.name));
    const parameters = this.urlFilterService.fromUrl();
    return parameters.concat(singleUrlParameter);
  }

  /** Прочитать данные сортировки из строки запроса браузера */
  private readSortFromUrl = (): SortFieldData[] => {
    return this.urlSortService.fromUrl();
  }

  /** Прочитать данные пагинации из строки запроса браузера */
  private readPaginationFromUrl = (): PaginationData | null => {
    return this.urlPaginationService.fromUrl();
  }
}

