import { ReplacementViewModel } from '@EmployeeModuleRoot/viewModel/ReplacementViewModel';
import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, Output, signal } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { ReplacementRepository } from '@EmployeeModuleRoot/service/repository/replacement.repository';
import { Replacement } from '@EmployeeModuleRoot/model/Replacement';
import { Employee } from '@components-lib';

@Component({
  selector: 'zms-replacement-edit',
  templateUrl: './replacement-edit.component.html',
  styleUrls: ['./replacement-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplacementEditComponent implements OnDestroy {

  constructor(
    private replacementRepository: ReplacementRepository,
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

  /** Модель */
  model = input<ReplacementViewModel, Replacement>(new ReplacementViewModel(), {
    transform: value => {
      const model: ReplacementViewModel = this.model();
      model.update(value);
      return model;
    }
  });

  /** Процесс сохранения */
  saving = signal(false);

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение сотрудника */
  saveClick = () : void => {
    const model = this.model();

    this.saving.set(true);
    if (model.Id !== 0) {
      this.replacementRepository.update(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error) => this.errorComplete(error)
      }, this.destroyer$);

    } else {
      this.replacementRepository.add(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error) => this.errorComplete(error)
      }, this.destroyer$);
    }

  }

  /** Обработчик команды закрытия окна */
  onCloseClick = () : void => {
    this.closed.emit();
  }

  /** Обработчик выбора сотрудника */
  onChangeEmployee = (item: Employee) : void => {
    const model = this.model();
    model.PostTitle.Value = item.Post;
  }

  /** Завершение изменения */
  private saveComplete() : void {
    this.saving.set(false);
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
