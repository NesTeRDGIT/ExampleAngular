import { PostRepository } from '@EmployeeModuleRoot/service/repository/post.repository';
import { PostViewModel } from '@EmployeeModuleRoot/viewModel/PostViewModel';
import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, Output, signal } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { Post } from '@EmployeeModuleRoot/model/dictionary/Post';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';

@Component({
  selector: 'zms-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostEditComponent implements OnDestroy {
  constructor(
    private postRepository: PostRepository,
    public dictionaryService: DictionaryService,
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


  model = input<PostViewModel, Post>(new PostViewModel(), {
    transform: value => {
      const model: PostViewModel = this.model();
      model.update(value);
      return model;
    }
  });


  /** Процесс сохранения */
  saving = signal(false);

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Сохранение сотрудника */
  saveEmployee = () : void => {
    const model = this.model();
    this.saving.set(true);
    if (model.Id !== 0) {
      this.postRepository.update(model.convert()).subscribeWithDestroy({
        next: () => this.saveComplete(),
        error: (error) => this.errorComplete(error)
      }, this.destroyer$);

    } else {
      this.postRepository.add(model.convert()).subscribeWithDestroy({
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
    this.messengerService.ShowSuccess("Должность изменена");
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
