import { WorkplaceViewModel } from '@EmployeeModuleRoot/viewModel/WorkplaceViewModel';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, OnDestroy, Output, signal, Injector } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { Workplace } from '@EmployeeModuleRoot/model/dictionary/Workplace';
import { WorkplaceRepository } from '@EmployeeModuleRoot/service/repository/workplace.repository';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'zms-workplace-edit',
  templateUrl: './workplace-edit.component.html',
  styleUrls: ['./workplace-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplaceEditComponent implements OnDestroy {
  constructor(
    private dictionaryRepository: WorkplaceRepository,
    private messengerService: MessengerService,
  private injector: Injector) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Событие изменения */
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** Модель */
  model = input<WorkplaceViewModel, Workplace | undefined>(new WorkplaceViewModel(), {
    transform: value => {
      const model: WorkplaceViewModel = this.model();
      if (value) {
        model.update(value);
      } else {
        model.update(new Workplace());
      }
      return model;
    }
  });

  /** Сигнал изменения имени */
  private name = toSignal(this.model().Name.change, { initialValue: this.model().Name.Value });
  

  /** Родительская запись */
  parent = input<Workplace>();

  /** Полное наименование */
  fullName = computed(() => {
    const parent = this.parent();
    const name = this.name();
    if (parent) {
      return `${parent.FullName}, ${name}`;
    } else {
      return name;
    }
  });

  /** Процесс сохранения */
  saving = signal(false);

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение сотрудника */
  onSave = () : void => {
    const model = this.model();
    this.saving.set(true);

    if (model.Value !== 0) {
      this.dictionaryRepository.update(model.convert()).subscribeWithDestroy({
        next: () => { this.saveComplete(); },
        error: (error) => { this.errorComplete(error); }
      }, this.destroyer$);
    } else {
      this.dictionaryRepository.add(model.convert()).subscribeWithDestroy({
        next: () => { this.saveComplete(); },
        error: (error) => { this.errorComplete(error); }
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
    this.messengerService.ShowSuccess("Место работы изменено");
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
