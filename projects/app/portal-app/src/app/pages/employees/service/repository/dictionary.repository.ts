import { ApiService } from "@shared-lib";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Sex } from "@EmployeeModuleRoot/model/dictionary/Sex";
import { Department } from "@EmployeeModuleRoot/model/dictionary/Department";
import { Post } from "@EmployeeModuleRoot/model/dictionary/Post";
import { WorkplaceTreeNode } from "@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode";
import { ApiClientService } from "@authorization-lib";
import { ChiefPosition } from "@EmployeeModuleRoot/model/dictionary/ChiefPosition";

@Injectable()
export class DictionaryRepository {

  constructor(private apiClient: ApiClientService, private apiService: ApiService) {
  }

  /** Получить пользователей */
  getSex = (): Observable<Sex[]> => {
    return this.apiClient
      .get<Sex[]>(this.apiService.GetUrl(`Employment/Thesaurus/Sex`))
      .pipe(map((response) => { return response.map(x => Sex.Create(x)) }));
  }

  /** Получить список отделов */
  getDepartment = (): Observable<Department[]> => {
    return this.apiClient
      .get<Department[]>(this.apiService.GetUrl(`Employment/Thesaurus/Department`), false)
      .pipe(map((response) => { return response.map(x => Department.Create(x)) }));
  }

  /** Получить список должностей */
  getPost = (): Observable<Post[]> => {
    return this.apiClient
      .get<Post[]>(this.apiService.GetUrl(`Employment/Thesaurus/Post`), false)
      .pipe(map((response) => { return response.map(x => Post.Create(x)) }));
  }

   /** Получить список должностей */
   getWorkplaceTreeNode = (): Observable<WorkplaceTreeNode[]> => {
    return this.apiClient
      .get<WorkplaceTreeNode[]>(this.apiService.GetUrl(`Employment/Thesaurus/Workplace`), false)
      .pipe(map((response) => { return response.map(x => WorkplaceTreeNode.Create(x)) }));
  }

   /** Получить список должностей */
   getChiefPosition = (): Observable<ChiefPosition[]> => {
    return this.apiClient
      .get<WorkplaceTreeNode[]>(this.apiService.GetUrl(`Employment/Thesaurus/ChiefPosition`), false)
      .pipe(map((response) => { return response.map(x => ChiefPosition.Create(x)) }));
  }
}
