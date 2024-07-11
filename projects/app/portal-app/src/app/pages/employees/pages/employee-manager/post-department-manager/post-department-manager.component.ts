
import { DepartmentRepository } from '@EmployeeModuleRoot/service/repository/department.repository';
import { Department } from '@EmployeeModuleRoot/model/dictionary/Department';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MessengerService, ProblemDetailApsNet, success, ObservableDestroyer, ComponentVisible } from '@shared-lib';
import { DictionaryRepository } from '@EmployeeModuleRoot/service/repository/dictionary.repository';
import { firstValueFrom } from 'rxjs';
import { Post } from '@EmployeeModuleRoot/model/dictionary/Post';
import { PostRepository } from '@EmployeeModuleRoot/service/repository/post.repository';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { TableSelection } from '@components-lib';

@Component({
  selector: 'zms-post-department-manager',
  templateUrl: './post-department-manager.component.html',
  styleUrls: ['./post-department-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDepartmentManagerComponent implements OnInit, OnDestroy {


  constructor(
    private dictionaryRepository: DictionaryRepository,
    private departmentRepository: DepartmentRepository,
    private postRepository: PostRepository,
    private dictionaryService: DictionaryService,
    private messengerService: MessengerService) {
  }

  ngOnInit(): void {
    this.load();
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Событие изменения */
  @Output() changed: EventEmitter<number> = new EventEmitter<number>();

  /** Процесс загрузки */
  loading = signal(false);

  /** Должности */
  postItems = signal<Post[]>([]);

  /** Выбранные Должности */
  postSelection = new TableSelection<Post>();

  onPostContextMenuSelect(): void {
    const selectItems = this.postSelection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];

      this.postSelection.contextMenuItems.set([
        { label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', command: () => { this.onEditPostClick(firstItem); } },
        { separator: true },
        { label: 'Удалить', icon: 'google-symbol close', styleClass: 'red-menuitem', command: () => { this.onRemovePostClick(selectItems) } }
      ]);
    }
  }

  /** Отделы */
  departmentItems = signal<Department[]>([]);

  /** Выбранные Отделы */
  departmentSelection = new TableSelection<Department>();

  onDepartmentContextMenuSelect(): void {
    const selectItems = this.departmentSelection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];

      this.postSelection.contextMenuItems.set([
        { label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', command: () => { this.onEditDepartmentClick(firstItem); } },
        { separator: true },
        { label: 'Удалить', icon: 'google-symbol close', styleClass: 'red-menuitem', command: () => { this.onRemoveDepartmentClick(selectItems) } }
      ]);
    }
  }

  /** Видимость редактора отдела */
  departmentEditVisible = new ComponentVisible(new Department());

  onEditDepartmentClick = (item: Department): void => {
    this.departmentEditVisible.show(item);
  }

  onAddDepartmentClick = (): void => {
    this.departmentEditVisible.show(new Department());
  }

  onRemoveDepartmentClick = (items: Department[]): void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          const uniqueId = [...new Set(items.map(x => x.Id))];

          this.loading.set(true);
          for (const departmentId of uniqueId) {
            await firstValueFrom(this.departmentRepository.remove(departmentId))
          }
          this.messengerService.ShowSuccess(`${items.length} записей удалено`);
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.loading.set(false);
          this.onDepartmentChanged();
        }
      }
    }, this.destroyer$);
  }

  onDepartmentCloseEdit = (): void => {
    this.departmentEditVisible.hide();
  }

  onDepartmentChanged = (): void => {
    this.load();
    this.dictionaryService.Department.reset();
  }

  /** Видимость редактора должностей */
  postEditVisible = new ComponentVisible(new Post());

  onEditPostClick = (item: Post): void => {
    this.postEditVisible.show(item);
  }

  onAddPostClick = (): void => {
    this.postEditVisible.show(new Post());
  }

  onRemovePostClick = (items: Post[]): void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          const uniqueId = [...new Set(items.map(x => x.Id))];

          this.loading.set(true);
          for (const postId of uniqueId) {
            await firstValueFrom(this.postRepository.remove(postId))
          }
          this.messengerService.ShowSuccess(`${items.length} записей удалено`);
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.loading.set(false);
          this.onPostChanged();
        }
      }
    }, this.destroyer$);
  }

  onPostCloseEdit = (): void => {
    this.postEditVisible.hide();
  }

  onPostChanged = (): void => {
    this.load();
    this.dictionaryService.Post.reset();
  }


  /** Обработчик ошибки */
  private error(error: unknown): void {
    this.messengerService.ShowException(error);
  }

  /** Загрузка  */
  load = (): void => {
    this.loading.set(true);
    this.dictionaryRepository.getDepartment().subscribeWithDestroy({
      next: (items) => {
        this.departmentItems.set(items);
        this.dictionaryRepository.getPost().subscribeWithDestroy({
          next: (items) => {
            this.postItems.set(items);
            this.loading.set(false);
          },
          error: (e: ProblemDetailApsNet) => {
            this.error(e);
            this.loading.set(false);
          }
        }, this.destroyer$);
      },
      error: (e: ProblemDetailApsNet) => {
        this.error(e);
        this.loading.set(false);
      }
    }, this.destroyer$)
  }
}
