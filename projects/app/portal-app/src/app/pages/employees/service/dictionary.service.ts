import { Injectable } from "@angular/core";
import { Sex } from "@EmployeeModuleRoot/model/dictionary/Sex";
import { Department } from "@EmployeeModuleRoot/model/dictionary/Department";
import { Post } from "@EmployeeModuleRoot/model/dictionary/Post";
import { DictionaryCache } from "@shared-lib";
import { DictionaryRepository } from "./repository/dictionary.repository";
import { WorkplaceTreeNode } from "@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode";
import { ChiefPosition } from "@EmployeeModuleRoot/model/dictionary/ChiefPosition";

@Injectable({ providedIn: 'root' })
export class DictionaryService {

  constructor(private repo: DictionaryRepository) {
    this.Department = new DictionaryCache(15, this.repo.getDepartment());
    this.Post = new DictionaryCache(15, this.repo.getPost());
    this.Sex = new DictionaryCache(15, this.repo.getSex());
    this.WorkplaceTree = new DictionaryCache(15, this.repo.getWorkplaceTreeNode());
    this.ChiefPosition = new DictionaryCache(15, this.repo.getChiefPosition());
  }

  /** Отделы */
  Department: DictionaryCache<Department>;

  /** Должности */
  Post: DictionaryCache<Post>;

  /** Справочник полов */
  Sex: DictionaryCache<Sex>;

  /** Справочник рабочих мест */
  WorkplaceTree: DictionaryCache<WorkplaceTreeNode>;

  /** Справочник руководящих должностей */
  ChiefPosition: DictionaryCache<ChiefPosition>;
}
