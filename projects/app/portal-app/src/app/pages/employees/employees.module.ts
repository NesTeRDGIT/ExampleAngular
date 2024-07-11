import { WorkplaceRepository } from './service/repository/workplace.repository';
import { ExpertAccountingRoutingModule } from "./employees-routing.module";
import { NgModule } from '@angular/core';

import { SharedModule } from "@shared-lib";
import { FilterModule } from "@filter-lib";
import { ComponentsModule } from '@components-lib';
import { DownloadModule } from '@download-lib';

import { EmployeeManagerComponent } from './pages/employee-manager/employee-manager.component';
import { EditEmployeeComponent } from './pages/employee-manager/edit-employee/edit-employee.component';
import { PhotosEditorComponent } from './pages/employee-manager/edit-employee/photos-editor/photos-editor.component';
import { CreateEmployeeComponent } from './pages/employee-manager/create-employee/create-employee.component';
import { EmployeeViewComponent } from './pages/employee-view/employee-view.component';
import { EmployeeCardComponent } from './pages/employee-view/employee-card/employee-card.component';
import { WorkplaceSelectComponent } from './pages/employee-manager/common/workplace-select/workplace-select.component';
import { WorkplacePartSelectComponent } from './pages/employee-manager/common/workplace-select/workplace-edit-panel/workplace-part-select/workplace-part-select.component';
import { WorkplaceEditPanelComponent } from './pages/employee-manager/common/workplace-select/workplace-edit-panel/workplace-edit-panel.component';
import { WorkplaceManagerComponent } from './pages/employee-manager/workplace-manager/workplace-manager.component';
import { WorkplaceEditComponent } from './pages/employee-manager/workplace-manager/workplace-edit/workplace-edit.component';
import { PostDepartmentManagerComponent } from './pages/employee-manager/post-department-manager/post-department-manager.component';
import { DepartmentEditComponent } from './pages/employee-manager/post-department-manager/department-edit/department-edit.component';
import { PostEditComponent } from './pages/employee-manager/post-department-manager/post-edit/post-edit.component';
import { WorkPeriodManagerComponent } from './pages/employee-manager/edit-employee/work-period-manager/work-period-manager.component';
import { WorkPeriodEditComponent } from './pages/employee-manager/edit-employee/work-period-manager/work-period-edit/work-period-edit.component';
import { EmployeeSummaryComponent } from './pages/employee-view/employee-summary/employee-summary.component';
import { ReplacementManagerComponent } from './pages/employee-manager/replacement-manager/replacement-manager.component';
import { ReplacementEditComponent } from './pages/employee-manager/replacement-manager/replacement-edit/replacement-edit.component';
import { SelectDateComponent } from './pages/employee-manager/common/select-date/select-date.component';


import { EmployeeListItemRepository } from './service/repository/employeeListItem.repository';
import { EmployeeRepository } from './service/repository/employee.repository';
import { DictionaryRepository } from './service/repository/dictionary.repository';
import { EmployeePhotoRepository } from "./service/repository/employeePhoto.repository";
import { PostRepository } from "./service/repository/post.repository";
import { DepartmentRepository } from "./service/repository/department.repository";
import { DictionaryService } from "./service/dictionary.service";
import { WorkPeriodRepository } from "./service/repository/workPeriod.repository";
import { EmployeeCardItemRepository } from "./service/repository/employeeCardItem.repository";
import { ReplacementRepository } from "./service/repository/replacement.repository";

@NgModule({
  imports: [ExpertAccountingRoutingModule, SharedModule, FilterModule, ComponentsModule, DownloadModule],
  declarations: [EmployeeManagerComponent, EditEmployeeComponent, PhotosEditorComponent, CreateEmployeeComponent,
    EmployeeViewComponent, EmployeeCardComponent, WorkplacePartSelectComponent, WorkplaceSelectComponent, WorkplaceEditPanelComponent,
    WorkplaceManagerComponent, WorkplaceEditComponent, PostDepartmentManagerComponent, DepartmentEditComponent, PostEditComponent,
    WorkPeriodManagerComponent, WorkPeriodEditComponent, EmployeeSummaryComponent,
    ReplacementManagerComponent, ReplacementEditComponent, SelectDateComponent
  ],
  providers: [
    { provide: EmployeeListItemRepository, useClass: EmployeeListItemRepository },
    { provide: EmployeeRepository, useClass: EmployeeRepository },
    { provide: DictionaryRepository, useClass: DictionaryRepository },
    { provide: DictionaryService, useClass: DictionaryService },
    { provide: EmployeePhotoRepository, useClass: EmployeePhotoRepository },
    { provide: WorkplaceRepository, useClass: WorkplaceRepository },
    { provide: PostRepository, useClass: PostRepository },
    { provide: DepartmentRepository, useClass: DepartmentRepository },
    { provide: WorkPeriodRepository, useClass: WorkPeriodRepository },
    { provide: EmployeeCardItemRepository, useClass: EmployeeCardItemRepository },
    { provide: ReplacementRepository, useClass: ReplacementRepository },
  ]
})
export class EmployeesModule { }

export { EmployeeManagerComponent } from './pages/employee-manager/employee-manager.component'
export { EmployeeViewComponent } from './pages/employee-view/employee-view.component'
