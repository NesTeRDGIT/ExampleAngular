import { NgModule } from '@angular/core';
import { EmployeeManagerComponent } from './pages/employee-manager/employee-manager.component'
import { RouterModule, Routes } from '@angular/router';
import { EmployeeViewComponent } from './pages/employee-view/employee-view.component';
import { createDataForValidateProfilesGuard, validateProfilesGuard } from '@authorization-lib';

const routes: Routes = [
  {
    path: '',
    component: EmployeeViewComponent
  },
  {
    path: 'manager',
    component: EmployeeManagerComponent,
    canActivate: [validateProfilesGuard],
    data: createDataForValidateProfilesGuard(v => v.Employee.HasRights)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertAccountingRoutingModule { }
