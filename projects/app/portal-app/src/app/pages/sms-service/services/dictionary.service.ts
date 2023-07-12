import { Injectable } from "@angular/core";
import { DictionaryRepository } from "./repository/dictionary.repository";
import { DictionaryCache } from "@shared-lib";
import { Status } from "../model/dictionary/Status";
import { Category } from "@SmsServiceModuleRoot/model/dictionary/Category";


@Injectable({ providedIn: 'root' })
export class DictionaryService {

  constructor(private repo: DictionaryRepository) {
    this.Status = new DictionaryCache(15, this.repo.getStatus());
    this.Category = new DictionaryCache(15, this.repo.getCategory());
  }

  /** Справочник статусов */
  Status: DictionaryCache<Status>;

  /** Справочник категорий */
  Category: DictionaryCache<Category>;
}
