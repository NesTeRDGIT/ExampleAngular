import { Summary } from '@SmsServiceModuleRoot/model/Summary';
import { Component, Output, EventEmitter } from '@angular/core';
import { MessengerService, ProblemDetailApsNet } from '@shared-lib';
import { MessageSummaryRepository } from '@SmsServiceModuleRoot/services/repository/messageSummary.repository';
import { FilterField, TypeComparer } from '@filter-lib';

@Component({
  selector: 'zms-message-summary',
  templateUrl: './message-summary.component.html',
  styleUrls: ['./message-summary.component.scss']
})
export class MessageSummaryComponent {
  constructor(
    private messengerService: MessengerService,
    private messageSummaryRepository: MessageSummaryRepository
  ) {
  }

  /** Событие фильтрации данных */
  @Output() filter = new EventEmitter<FilterField[]>();

  /** В процессе загрузки */
  loading = false;

  model = [new Summary()];

  /**Прошлый выбор фильтра */
  summaryFilterState = "Total";

  /**Фильтр по статусам  */
  filterBySummary = (summaryFilterState: string) => {
    if(this.summaryFilterState == summaryFilterState && summaryFilterState == "Total"){
      return;
    }
    const filter: FilterField[] = [];
    this.summaryFilterState = this.summaryFilterState == summaryFilterState ? "Total" : summaryFilterState;

    switch (this.summaryFilterState) {
      case "New":
        filter.push(FilterField.CreateCustom('StatusValue', TypeComparer.equals, 'new'));
        break;
      case "InProcessing":
        filter.push(FilterField.CreateCustom('StatusValue', TypeComparer.equals, 'inProcessing'));
        break;
      case "Sent":
        filter.push(FilterField.CreateCustom('StatusValue', TypeComparer.equals, 'sent'));
        break;
      case "Error":
        filter.push(FilterField.CreateCustom('StatusValue', TypeComparer.equals, 'error'));
        break;
    }
    this.filter.emit(filter);
  }

  /** Очистка выбранного фильтра */
  clearFilter = () => {
    this.summaryFilterState = "Total";
  }

  /**Загрузка  */
  load = async (filter: FilterField[]) => {
    this.loading = true;

    this.messageSummaryRepository.get(filter).subscribe({
      next: result => {
        this.model = [result];
        this.loading = false;
      },
      error: (e: ProblemDetailApsNet) => { this.messengerService.ShowException(e); this.loading = false; }
    });
  }
}
