import { EmployeeViewModel } from '@EmployeeModuleRoot/viewModel/EmployeeViewModel';
import { EmployeeRepository } from '@EmployeeModuleRoot/service/repository/employee.repository';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, computed, input, signal } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { Store } from '@ngrx/store';
import { authenticatedFeature } from '@authorization-lib';

@Component({
  selector: 'zms-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEmployeeComponent implements OnInit, OnDestroy {
  constructor(
    private employeeRepository: EmployeeRepository,
    public dictionaryService: DictionaryService,
    private messengerService: MessengerService,
    private store$: Store) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  ngOnInit(): void {
    this.load();
  }

  /** Событие изменения */
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** Идентификатор сотрудника */
  employeeId = input(0);

  /** Профиль пользователя */
  userProfile = this.store$.selectSignal(authenticatedFeature.employeeProfile);

  /** Может ли редактировать данные сотрудника */
  canEdit = computed(() => this.userProfile().Admin || this.userProfile().Writer);

  /** Может ли редактировать замещение */
  canEditReplacement = computed(() => this.userProfile().Admin || this.userProfile().Writer || this.userProfile().ReplacementModifier);

  /** Процесс загрузки */
  loading = signal(false);

  /** Процесс сохранения */
  saving = signal(false);

  /** Модель */
  employee = signal(new EmployeeViewModel());

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение сотрудника */
  saveEmployee = () : void => {
    this.saving.set(true);
    this.employeeRepository.update(this.employee().convert()).subscribeWithDestroy({
      next: () => this.saveComplete(),
      error: (e: ProblemDetailApsNet) => this.error(e)
    }, this.destroyer$);
  }

  /** Обработчик команды закрытия окна */
  onCloseClick = () : void => {
    this.closed.emit();
  }

  /** Завершение изменения */
  private saveComplete() : void {
    this.saving.set(false);
    this.messengerService.ShowSuccess("Сотрудник изменен");
    this.onCloseClick();
    this.changed.emit(this.employee().Id);
  }

  /** Обработчик ошибки */
  private error(error: ProblemDetailApsNet) : void {
    this.saving.set(false);
    if (error.is400StatusCode)
      this.errors.set(error.FullError);
    else
      this.messengerService.ShowException(error)
  }

  /** Загрузка */
  private load = () : void => {
    this.loading.set(true);
    this.employeeRepository.get(this.employeeId()).subscribeWithDestroy({
      next: (item) => {
        this.employee.update(value => {
          value.update(item);
          return value;
        });
        this.loading.set(false);
      },
      error: (e: ProblemDetailApsNet) => {
        this.error(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }
}
