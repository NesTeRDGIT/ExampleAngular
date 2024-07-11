import { Summary } from '@EmployeeModuleRoot/model/Summary';
import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { FilterField, TypeComparer } from '@filter-lib';
import { EmployeeCardItem } from '@EmployeeModuleRoot/model/EmployeeCardItem';

@Component({
  selector: 'zms-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSummaryComponent {

  /** Событие фильтрации данных */
  @Output() filter = new EventEmitter<FilterField[]>();

  /** В процессе загрузки */
  loading = signal(false);

  model = signal<Summary[]>([new Summary()]);

  /**Прошлый выбор фильтра */
  summaryFilterState = signal<SummaryFilterStateType>("Total");

  /**Фильтр по статусам  */
  filterBySummary = (summaryFilterState: SummaryFilterStateType): void => {
    let currentSummaryFilterState = this.summaryFilterState();

    if (currentSummaryFilterState === summaryFilterState && summaryFilterState == "Total") {
      return;
    }
    const filter: FilterField[] = [];
    currentSummaryFilterState = currentSummaryFilterState == summaryFilterState ? "Total" : summaryFilterState;
    this.summaryFilterState.set(currentSummaryFilterState);

    switch (currentSummaryFilterState) {
      case "MainOffice":
        filter.push(FilterField.CreateCustom('WorkplaceMainOffice', TypeComparer.equals, true));
        break;
      case "DistrictOffice":
        filter.push(FilterField.CreateCustom('WorkplaceDistrictOffice', TypeComparer.equals, true));
        break;
      case "Total":
        break;
    }
    this.filter.emit(filter);
  }

  /** Убрать фильтрацию */
  clearFilter = (): void => {
    this.summaryFilterState.set('Total');
  }

  /**Обновить данные */
  update = (items: EmployeeCardItem[]): void => {
    const summary = new Summary();

    items.forEach(x => {
      summary.Total++;

      if (x.WorkplaceDistrictOffice) {
        summary.DistrictOffice++;
      }
      if (x.WorkplaceMainOffice) {
        summary.MainOffice++;
      }
    });

    this.model.set([summary]);
  }
}

type SummaryFilterStateType = "Total" | "MainOffice" | "DistrictOffice";