import { Component, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { WorkPeriodRepository } from '@EmployeeModuleRoot/service/repository/workPeriod.repository';
import { WorkPeriodViewModel } from '@EmployeeModuleRoot/viewModel/WorkPeriodViewModel';
import { WorkPeriod } from '@EmployeeModuleRoot/model/WorkPeriod';

@Component({
  selector: 'zms-work-period-edit',
  templateUrl: './work-period-edit.component.html',
  styleUrls: ['./work-period-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPeriodEditComponent implements OnDestroy {

  constructor(
    private repo: WorkPeriodRepository,
    private messengerService: MessengerService) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Список ошибок */
  errors = signal<string[]>([]);

  /** Модель */
  model = input<WorkPeriodViewModel, WorkPeriod>(new WorkPeriodViewModel(), {
    transform: (value) => {
      const model: WorkPeriodViewModel = this.model();
      model.update(value);
      return model;
    }
  });

  /** Событие изменения */
  @Output() changed = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** В процессе сохранения */
  saving = signal(false);

  /** Обработчик команды сохранения */
  onSaveClick = () : void => {
    const model = this.model();
    this.saving.set(true);
    if (model.Id === 0) {
      this.repo.add(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error: ProblemDetailApsNet) => this.error(error)
      }, this.destroyer$);
    } else {
      this.repo.update(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error: ProblemDetailApsNet) => this.error(error)
      }, this.destroyer$);
    }
  }

  /** Обработчик команды закрытия окна */
  onCloseClick = () : void => {
    this.closed.emit();
  }

  /** Завершение изменения */
  private saveComplete() : void {
    this.saving.set(false);
    this.changed.emit(this.model().Id);
    this.onCloseClick();
  }

  /** Ошибка сохранения */
  private error(error: ProblemDetailApsNet) : void {
    this.saving.set(false);
    if (error.is400StatusCode)
      this.errors.set(error.FullError);
    else
      this.messengerService.ShowException(error)
  }
}
