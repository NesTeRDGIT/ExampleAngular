import { FieldInfo } from './../model/FieldInfo';
import { UrlFilterService } from '../service/urlFilter.service';
import { FilterField } from '../model/FilterField';
import { AppInjector } from '../filter.module'
import { UrlParameter, UrlService } from '@shared-lib';
import { PaginationData } from './PaginationData';
import { SortFieldData } from './SortFieldData';
import { UrlSortService } from '../service/urlSort.service';
import { UrlPaginationService } from '../service/urlPagination.service';
import { Collection } from './Collection';

/** Коллекция с фильтром на стороне сервера */
export class FilterServerSideCollection<T>{

  /** Базовая коллекция */
  private itemsBase = new Collection<T>([]);

  /** Фильтр по умолчанию */
  _defaultFilterInfo: FieldInfo[] = [];

  constructor(fullItems: T[]) {
    this.itemsBase.updateItems(fullItems);
  }



  /** Описание фильтра по умолчанию */
  get defaultFilterInfo(): T[] {
    return this.itemsBase.items;
  }



  /** Фильтрованные элементы */
  get items(): T[] {
    return this.itemsBase.items;
  }


  private _filter: FilterField[] = [];

  /** Последний примененный фильтр */
  get filter(): FilterField[] {
    return [...this._filter];
  }


  private _totalCount = 0;

  /** Количество элементов всего */
  get totalCount(): number {
    return this._totalCount;
  }


  private _pagination: PaginationData | null = null;

  /** Количество элементов всего */
  get pagination(): PaginationData {
    return this._pagination ?? new PaginationData(0, 200);
  }


  private _sort: SortFieldData[] = [];

  /** Последние данные о сортировке */
  get sort(): SortFieldData[] {
    return this._sort;
  }


  /** Обновить элементы(новый набор + сброс фильтров) */
  updateItems = (items: T[], filter: FilterField[], totalCount = 0, pagination: PaginationData | null = null, sort: SortFieldData[] = []) => {
    this._filter = filter;
    this._pagination = pagination;
    this._sort = sort;
    this._totalCount = totalCount;
    this.itemsBase.updateItems(items);
  }

  /** Сброс элементов (новый класс массива с теми же элементами) */
  resetItems = () => {
    this.itemsBase.resetItems();
  }

  /** Обновить данные в строке браузера клиента */
  writeToUrl = () => {

    const urlService = AppInjector.get(UrlService);
    const urlFilterService = AppInjector.get(UrlFilterService);
    const urlSortService = AppInjector.get(UrlSortService);
    const urlPaginationService = AppInjector.get(UrlPaginationService);
    const urlParameters: UrlParameter[] = [];
    this.clearUrl();

    if (this.filter.length !== 0) {
      urlParameters.push(...urlFilterService.toUrlParameters(this.filter));
    } else {
      urlFilterService.clearUrl();
    }


    if (this._pagination != null) {
      urlParameters.push(...urlPaginationService.toUrlParameters(this._pagination));
    } else {
      urlPaginationService.clearUrl();
    }

    if (this._sort.length !== 0) {
      urlParameters.push(urlSortService.toUrlParameter(this._sort));
    } else {
      urlSortService.clearUrl();
    }

    urlParameters.forEach(parameter => {
      urlService.changeUrlParameter(parameter.value, parameter.name);
    });
  }

  /** Очистить данные в строке браузера клиента */
  clearUrl = () => {
    const urlFilterService = AppInjector.get(UrlFilterService);
    const urlSortService = AppInjector.get(UrlSortService);
    const urlPaginationService = AppInjector.get(UrlPaginationService);

    urlFilterService.clearUrl();
    urlPaginationService.clearUrl();
    urlSortService.clearUrl();
  }

  /** Признак предустановленных значений по умолчанию */
  hasDefault = false;

  /** Прочитать параметры из Url
   * @param singleUrlName - отдельный параметры фильтра(добавятся в фильтр)
   */
  readFromUrl = (singleUrlName: string[] = []) => {
    this._sort = this.readSortFromUrl();
    this._pagination = this.readPaginationFromUrl();
    this._defaultFilterInfo = this.readFilterFromUrl(singleUrlName);
    if (this._sort.length == 0 && this._pagination == null && this._defaultFilterInfo.length == 0) {
      this.hasDefault = false;
    } else {
      this.hasDefault = true;
    }

  }

  /** Прочитать данные из Url */
  private readFilterFromUrl = (singleUrlName: string[] = []): FieldInfo[] => {
    const urlFilterService = AppInjector.get(UrlFilterService);
    const urlService = AppInjector.get(UrlService);

    const singleUrlParameter = urlService.getParameters().filter(x => singleUrlName.find(n => n == x.name));
    const parameters = urlFilterService.fromUrl();
    return parameters.concat(singleUrlParameter);
  }


  /** Обновить данные в строке браузера клиента */
  private readSortFromUrl = (): SortFieldData[] => {
    const urlSortService = AppInjector.get(UrlSortService);
    return urlSortService.fromUrl();
  }

  /** Обновить данные в строке браузера клиента */
  private readPaginationFromUrl = (): PaginationData | null => {
    const urlPaginationService = AppInjector.get(UrlPaginationService);
    return urlPaginationService.fromUrl();
  }
}
