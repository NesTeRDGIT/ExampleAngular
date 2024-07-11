import { Injectable } from "@angular/core";
import { UrlParameter } from '../../../class/UrlParameter';
import { MetadataParameter } from "../../../class/Metadata/MetadataParameter";

/** Сервис для фильтрации */
@Injectable({ providedIn: 'root' })
export class UrlMetadataService {

  /** Получить UrlParameter[] из параметров пагинации */
  toUrlParameters = (metadataParameter: MetadataParameter): UrlParameter[] => {
    if (metadataParameter.Pagination.value){
      return [new UrlParameter(metadataParameter.Pagination.parameter, metadataParameter.Pagination.value.toString())];
    }
    return [];
  }
}




