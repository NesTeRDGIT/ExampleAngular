import { SortFieldData } from '../../class/SortFieldData';
import { Injectable } from "@angular/core";
import { FilterField } from "../../model/FilterField";
import { PaginationData } from '../../class/PaginationData';
import { UrlPaginationService } from './services/urlPagination.service';
import { UrlSortService } from './services/urlSort.service';
import { UrlFilterService } from './services/urlFilter.service';
import { UrlParameter } from '@shared-lib';
import { UrlMetadataService } from './services/urlMetadata.service';
import { MetadataParameter } from '../../class/Metadata/MetadataParameter';
import { QueryParameters } from '../../class/QueryParameters';

/** Сервис получения URL для фильтрации на сервере */
@Injectable({ providedIn: 'root' })
export class UrlServerSideService {

  constructor(
    private urlFilterService: UrlFilterService,
    private urlPaginationService: UrlPaginationService,
    private urlSortService: UrlSortService,
    private urlMetadataService: UrlMetadataService
  ) { }

  /** Получить Url из набора фильтров
   * @param baseAddress - Адрес хоста
   * @param filterList  - Список фильтров
   * @param pagination - Данные о пагинации
   * @param sort - Данные о сортировке
   * @param customParameter - пользовательские параметры
   * @param metadataParameter - параметры запроса метаданных
  */
  getUrl(baseAddress: string, filterList: FilterField[] = [], pagination: PaginationData | null = null, sort: SortFieldData[] = [], metadataParameter: MetadataParameterInput = false, customParameter: UrlParameter[] = []): string {

    const urlParameters = this.urlFilterService.toUrlParameters(filterList.filter(x => x.hasValue));

    if (pagination != null) {
      urlParameters.push(...this.urlPaginationService.toUrlParameters(pagination));
    }

    if (sort.length !== 0) {
      urlParameters.push(this.urlSortService.toUrlParameter(sort));
    }

    if (customParameter.length !== 0) {
      urlParameters.push(...customParameter);
    }

    urlParameters.push(...this.urlMetadataService.toUrlParameters(this.getMetadataParameter(metadataParameter)));

    if (urlParameters.length !== 0) {
      return `${baseAddress}?${urlParameters.map(x => `${x.name}=${x.value}`).join('&')}`;
    } else {
      return baseAddress;
    }
  }

  private getMetadataParameter = (metadataParameter: MetadataParameterInput): MetadataParameter => {
    const result = new MetadataParameter();
    if (typeof metadataParameter == 'boolean') {
      result.Pagination.value = metadataParameter;
      return result;
    }
    if (metadataParameter instanceof MetadataParameter) {
      return metadataParameter;
    }
    return result;
  }

  /** Получить параметры из Url */
  getParameterFromUrl = (): QueryParameters => {
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

/** Параметры метаданных */
export type MetadataParameterInput = MetadataParameter | boolean;

