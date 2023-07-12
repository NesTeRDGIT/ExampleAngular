import { Injectable } from "@angular/core";
import { PaginationData } from "../class/PaginationData";
import { SortFieldData } from "../class/SortFieldData";

import { Table, TableLazyLoadEvent } from "primeng/table";
import { SortMeta } from "primeng/api"
import { FilterPanelComponent } from "../component/filter-panel/filter-panel.component";
import { FilterServerSideCollection } from "../class/FilterServerSideCollection";
import { ArgumentNullException } from "@shared-lib";



@Injectable({ providedIn: 'root' })
export class PrimeLazyLoadService {

  /** Создать PaginationData из TableLazyLoadEvent */
  createPaginationData = (event: TableLazyLoadEvent): PaginationData => {
    return new PaginationData(event.first ?? 0, event.rows ?? 0);
  }

  /** Создать PaginationData из Table */
  createPaginationDataFromTable = (table: Table | undefined): PaginationData => {
    if (table !== undefined) {

      return new PaginationData(table.first ?? 0, table.rows ?? 0);
    }
    throw new ArgumentNullException("Table");
  }

  /** Переместить Table на первую страницу и вернуть PaginationData */
  toFirstPaginationTable = (table: Table | undefined): PaginationData => {
    if (table !== undefined) {
      table.first = 0;
      return new PaginationData(table.first, table.rows  ?? 0);
    }
    throw new ArgumentNullException("Table");
  }

  /** Создать SortFieldData[] из PrimeLazyLoadEvent */
  createSortFields = (event: TableLazyLoadEvent): SortFieldData[] => {
    return event.multiSortMeta ? event.multiSortMeta.filter(x => x.order != 0).map(x => new SortFieldData(x.field, x.order == 1 ? 'Asc' : 'Desc')) : [];
  }

  /** Создать SortFieldData[] из TableLazyLoadEvent */
  createSortFieldsFromTable = (table: Table | undefined): SortFieldData[] => {
    if (table !== undefined) {
      return table.multiSortMeta ? table.multiSortMeta.filter(x => x.order != 0).map(x => new SortFieldData(x.field, x.order == 1 ? 'Asc' : 'Desc')) : [];
    }
    throw new ArgumentNullException("Table");
  }

  /** Применить фильтры(FieldInfo) к панели фильтров */
  applyFieldInfoFields = <T>(filterPanel: FilterPanelComponent | null | undefined, table: Table | null | undefined, collection: FilterServerSideCollection<T>) => {

    if (collection.hasDefault) {
      setTimeout(() => {
        if (filterPanel) {
          if (collection._defaultFilterInfo.length !== 0) {
            filterPanel.setDefaultValue(collection._defaultFilterInfo);
          }
        }

        if (table) {
          if (collection.pagination) {
            table.first = collection.pagination.first;
            table.rows = collection.pagination.rows;
          }
          if (collection.sort.length !== 0) {
            const sortMeta = collection.sort.map(x => {
              const sort: SortMeta = { field: x.fieldName, order: x.order == 'Asc' ? 1 : -1 };
              return sort;
            });
            table.multiSortMeta = sortMeta;
          }
        }

        collection.hasDefault = false;

        if (table?.lazy && table.multiSortMeta) {
          table.tableService.onSort(table.multiSortMeta);
          filterPanel?.filterSubmit();
        } else {
          filterPanel?.filterSubmit();
        }
      }, 0);
    } else {
      setTimeout(() => {
        if (table?.lazy && table.multiSortMeta) {
          table.tableService.onSort(table.multiSortMeta);
          filterPanel?.filterSubmit();
        } else {
          filterPanel?.filterSubmit();
        }
      }, 0);
    }
  }
}
