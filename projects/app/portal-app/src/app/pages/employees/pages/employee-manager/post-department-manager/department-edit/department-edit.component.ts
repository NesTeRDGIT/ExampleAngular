import { DepartmentRepository } from '@EmployeeModuleRoot/service/repository/department.repository';
import { DepartmentViewModel } from '@EmployeeModuleRoot/viewModel/DepartmentViewModel';
import { Department } from '@EmployeeModuleRoot/model/dictionary/Department';
import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, Output, signal } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';

@Component({
  selector: 'zms-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentEditComponent implements OnDestroy {
  constructor(
    private departmentRepository: DepartmentRepository,
    private messengerService: MessengerService) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Событие изменения */
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  model = input<DepartmentViewModel, Department | undefined>(new DepartmentViewModel(), {
    transform: value => {
      const model: DepartmentViewModel = this.model();
      if (value) {
        model.update(value);
        return model;
      } else {
        return new DepartmentViewModel();
      }
    }
  });

  /** Процесс сохранения */
  saving = signal(false);

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение */
  saveEmployee = () : void => {
    const model = this.model();
    this.saving.set(true);
    if (model.Id !== 0) {
      this.departmentRepository.update(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error) => this.errorComplete(error)
      }, this.destroyer$);

    } else {
      this.departmentRepository.add(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error) => this.errorComplete(error)
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
    this.messengerService.ShowSuccess("Отдел изменен");
    this.onCloseClick();
    this.changed.emit();
  }

  /** Обработчик ошибки */
  private errorComplete(error: unknown) : void {
    this.saving.set(false);
    if (error instanceof ProblemDetailApsNet) {
      if (error.is400StatusCode) {
        this.errors.set(error.FullError);
      } else {
        this.messengerService.ShowException(error);
      }
    }
    else {
      this.messengerService.ShowException(error);
    }
  }
}
