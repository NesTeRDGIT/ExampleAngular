import { CreateEmployeeViewModel } from '@EmployeeModuleRoot/viewModel/CreateEmployeeViewModel';
import { EmployeeRepository } from '@EmployeeModuleRoot/service/repository/employee.repository';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output, signal } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';


@Component({
  selector: 'zms-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEmployeeComponent implements OnDestroy {
  constructor(
    private employeeRepository: EmployeeRepository,
    public dictionaryService: DictionaryService,
    private messengerService: MessengerService) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Событие отмены */
  @Output() create: EventEmitter<number> = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** Процесс сохранения */
  saving = signal(false);

  /** Модель */
  employee = signal(new CreateEmployeeViewModel());

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение сотрудника */
  saveEmployee = () : void => {
    const employee = this.employee();
    this.saving.set(true);
    this.employeeRepository.add(employee.convert(), employee.DateStart.Value, employee.DateEnd.Value)
      .subscribeWithDestroy({
        next: (employeeId) => {
          this.saveComplete(employeeId);
          this.saving.set(false);
        },
        error: (e: ProblemDetailApsNet) => {
          this.error(e);
          this.saving.set(false);
        }
      }, this.destroyer$);
  }

  /** Завершение изменения */
  private saveComplete(employeeId: number) : void {
    this.messengerService.ShowSuccess("Сотрудник создан");
    this.create.emit(employeeId);
    this.closed.emit();
  }

  /** Обработчик ошибки */
  private error(error: ProblemDetailApsNet) : void {
    if (error.is400StatusCode)
      this.errors.set(error.FullError);
    else
      this.messengerService.ShowException(error)
  }
}
