import { FieldInfo } from "../model/FieldInfo";
import { PaginationData } from "./PaginationData";
import { SortFieldData } from "./SortFieldData";

/** Информация о параметрах запроса */
export interface QueryParameters {
  readonly filter: FieldInfo[];
  readonly sort:  SortFieldData[];
  readonly pagination: PaginationData | null;
}
