import { Injectable } from "@angular/core";
import { PaginationData } from "../class/PaginationData";
import { SortFieldData } from "../class/SortFieldData";
import { FilterPanelComponent } from "../component/filter-panel/filter-panel.component";
import { FilterServerSideCollection } from "../class/FilterServerSideCollection";
import { ArgumentNullException } from "@shared-lib";
import { FieldInfo } from "../model/FieldInfo";
import { QueryParameters } from "../class/QueryParameters";
import { BrowserQueryStringService } from "./browserQueryString.service";
import { TableComponent, TableLazyLoadEvent } from "@components-lib";
import { SortMeta } from "primeng/api";

@Injectable({ providedIn: 'root' })
export class TableLazyLoadService {

  constructor(private BrowserQueryStringService:BrowserQueryStringService){

  }

  /** Создать PaginationData из TableLazyLoadEvent */
  createPaginationData = (event: TableLazyLoadEvent): PaginationData => {
    return new PaginationData(event.first ?? 0, event.rows ?? 0);
  }

  /** Создать PaginationData из Table */
  createPaginationDataFromTable = (table: TableComponent<unknown> | undefined): PaginationData => {
    const primeTable = table?.primeTable;
    if (primeTable !== undefined) {
      return new PaginationData(primeTable.first ?? 0, primeTable.rows ?? 0);
    }
    throw new ArgumentNullException("Table");
  }

  /** Переместить Table на первую страницу и вернуть PaginationData */
  toFirstPaginationTable = (table: TableComponent<unknown> | undefined): PaginationData => {
    const primeTable = table?.primeTable;
    if (primeTable !== undefined) {
      primeTable.first = 0;
      return new PaginationData(primeTable.first, primeTable.rows ?? 0);
    }
    throw new ArgumentNullException("Table");
  }

  /** Создать SortFieldData[] из PrimeLazyLoadEvent */
  createSortFields = (event: TableLazyLoadEvent): SortFieldData[] => {
    return event.multiSortMeta ? event.multiSortMeta.filter(x => x.order !== 'none').map(x => new SortFieldData(x.field, x.order == 'asc' ? 'Asc' : 'Desc')) : [];
  }

  /** Создать SortFieldData[] из TableLazyLoadEvent */
  createSortFieldsFromTable = (table: TableComponent<unknown>| undefined): SortFieldData[] => {
    const primeTable = table?.primeTable;
    if (primeTable !== undefined) {
      return primeTable.multiSortMeta ? primeTable.multiSortMeta.filter(x => x.order != 0).map(x => new SortFieldData(x.field, x.order == 1 ? 'Asc' : 'Desc')) : [];
    }
    throw new ArgumentNullException("Table");
  }

  /** Требуется ли данные о пагинации
   * @param event - событие TableLazyLoadEvent
   * @param collection - данные о коллекции
   * @
   */
  isGetMetadataPagination = <T>(event: TableLazyLoadEvent, collection: FilterServerSideCollection<T> | null): boolean => {
    if (collection != null) {
      const currentPagination = this.createPaginationData(event);
      const totalCount = collection.totalCount();
      /** Если последняя страница */
      if (currentPagination.first + currentPagination.rows >= totalCount){
        return true;
      }
      return false;
    }
    return true;
  }


  /** Применить параметры выборки к таблице и панели фильтров
   * @param filterPanel - Панель фильтров
   * @param Table - Таблица
   * @param parameters - параметры запроса. string[] - отдельные параметры фильтра для readFromUrl, FilterServerSideCollection - коллекция данные будут взяты из нее,
   * null - будет вызван BrowserQueryStringService.readFromUrl, по умолчанию - null
   * @param submitFilter - вызывать событие submitFilter в filterPanel
   */
    applyQueryParameters(filterPanel: FilterPanelComponent | null | undefined, table: TableComponent<unknown>| null | undefined, parameters?: string[], submitFilter?:boolean) : void;
    applyQueryParameters<T>(filterPanel: FilterPanelComponent | null | undefined, table: TableComponent<unknown>| null | undefined, parameters?: FilterServerSideCollection<T>, submitFilter?:boolean) : void;
    applyQueryParameters(filterPanel: FilterPanelComponent | null | undefined, table: TableComponent<unknown>| null | undefined, parameters?: QueryParameters | null, submitFilter?: boolean) : void;
    applyQueryParameters<T>(filterPanel: FilterPanelComponent | null | undefined, table: TableComponent<unknown>| null | undefined, parameters: QueryParameters | FilterServerSideCollection<T> | string[] | null = null, submitFilter = true) : void
    {
      const primeTable = table?.primeTable;
      
      let param: QueryParameters = {
        filter: [],
        sort: [],
        pagination: new PaginationData(0, 0)
      };

      if (Array.isArray(parameters)) {
        param = this.BrowserQueryStringService.readFromUrl(parameters);
      } else {
        if (parameters instanceof FilterServerSideCollection) {
          param = {
            filter: parameters.filter().map(x => new FieldInfo(x.field[0], x.value)),
            sort: parameters.sort(),
            pagination: parameters.pagination()
          }
        } else {
          param = parameters ?? this.BrowserQueryStringService.readFromUrl();
        }
      }

      setTimeout(() => {
      if (filterPanel) {
        if (param.filter.length !== 0) {
          filterPanel.setDefaultValue(param.filter);
        }
      }

      if (primeTable) {
        
        if (param.pagination) {
          
          primeTable.first = param.pagination.first;
          primeTable.rows = param.pagination.rows;
        }
        if (param.sort.length !== 0) {
          const sortMeta = param.sort.map(x => { return { field: x.fieldName, order: x.order == 'Asc' ? 1 : -1 } as SortMeta});
          primeTable.multiSortMeta = sortMeta;
        }
      }
      if (primeTable?.lazy && primeTable.multiSortMeta) {
        primeTable.tableService.onSort(primeTable.multiSortMeta);
      }
      if (submitFilter) {
        filterPanel?.filterSubmit();
      }
    }, 0);

}

  /** Промотать scroll Table для первого выбранного элемента */
  scrollIntoSelect = (table: TableComponent<unknown> | null | undefined) : void => {
    const primeTable = table?.primeTable;

    if (primeTable) {
      const wrapper: HTMLElement = primeTable.el.nativeElement.children[0].getElementsByClassName('p-datatable-wrapper')[0];
      const body = wrapper.getElementsByClassName('p-datatable-tbody')[0] as HTMLElement;
      const rows: HTMLCollection = body.getElementsByClassName('p-selectable-row p-highlight');

      if (rows.length !== 0) {
        const rowEl = rows[0] as HTMLElement;
        if((wrapper.offsetHeight-body.offsetTop) <= (rowEl.offsetTop-body.offsetTop)){
          wrapper.scrollTop = rowEl.offsetTop - body.offsetTop;
        }
      }
    }
  }
}
