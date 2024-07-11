import { ComponentVisible, ObservableDestroyer, success } from '@shared-lib';
import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MessengerService, ProblemDetailApsNet } from '@shared-lib';
import { firstValueFrom } from 'rxjs';
import { Replacement } from '@EmployeeModuleRoot/model/Replacement';
import { Collection } from '@filter-lib';
import { ReplacementRepository } from '@EmployeeModuleRoot/service/repository/replacement.repository';
import { authenticatedFeature } from '@authorization-lib';
import { Store } from '@ngrx/store';
import { TableSelection } from '@components-lib';

@Component({
  selector: 'zms-replacement-manager',
  templateUrl: './replacement-manager.component.html',
  styleUrls: ['./replacement-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplacementManagerComponent implements OnInit, OnDestroy {

  constructor(
    private replacementRepository: ReplacementRepository,
    private messengerService: MessengerService,
    private store$: Store) {

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

  /** Идентификатор сотрудника */
  employeeId = input.required<number>();

  /** Профиль пользователя */
  userProfile = this.store$.selectSignal(authenticatedFeature.employeeProfile);

  /** Процесс загрузки */
  loading = signal(false);

  /** Замещения */
  replacements = new Collection<Replacement>([]);

  /** Выбранные элементы */
  selection = new TableSelection<Replacement>();

  onContextMenuSelect(): void {
    const selectItems = this.selection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];

      const userProfile = this.userProfile();
      const canEdit = !firstItem.Started;
      const canDelete = selectItems.every(x => !x.Started) || userProfile.Admin;
      const canChangeDateEnd = selectItems.every(x => !x.Ended);
      this.selection.setContextMenu(menuItems => {
        menuItems.push({ label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', disabled: !canEdit, command: () => { this.onEditClick(firstItem); } });
        menuItems.push({ label: 'Изменить дату окончания', icon: 'google-symbol edit', disabled: !canChangeDateEnd, command: () => { this.onSelectDateEndClick(firstItem); } });
        menuItems.push({ separator: true });
        menuItems.push({ label: 'Удалить', icon: 'google-symbol close', styleClass: 'red-menuitem', disabled: !canDelete, command: () => { this.onRemoveClick(selectItems) } });
      });
    }
  }

  /** Видимость окна редактирования */
  editVisible = new ComponentVisible<Replacement>(new Replacement());

  onAddClick = (): void => {
    const replacement = new Replacement();
    replacement.EmployeeId = this.employeeId();
    this.editVisible.show(replacement);
  }

  onEditClick = (item: Replacement): void => {
    this.editVisible.show(item);
  }

  onCloseEdit = (): void => {
    this.editVisible.hide();
  }

  /** Видимость окна редактирования */
  selectDateVisible = new ComponentVisible<ReplacementWithDate>(new ReplacementWithDate());

  onSelectDateEndClick = (item: Replacement): void => {
    const replacementWithDate = new ReplacementWithDate();
    replacementWithDate.Replacement = item;
    replacementWithDate.Date = item.DateEnd;
    this.selectDateVisible.show(replacementWithDate);
  }

  onSelectDateEnd = (item: Replacement, date: Date): void => {
    this.onCloseSelectDate();
    this.replacementRepository.updateDateEnd(item, date).subscribeWithDestroy({
      next: () => this.onModelChange(),
      error: (e) => {
        this.messengerService.ShowException(e);
        this.onModelChange();
      }
    }, this.destroyer$);
  }

  onCloseSelectDate = (): void => {
    this.selectDateVisible.hide();
  }

  onRemoveClick = (items: Replacement[]): void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          this.loading.set(true);
          for (const item of items) {
            await firstValueFrom(this.replacementRepository.remove(item))
          }
          this.messengerService.ShowSuccess(`${items.length} записей удалено`);
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.loading.set(false);
          this.load();
        }
      }
    }, this.destroyer$);
  }

  onModelChange = (): void => {
    this.load();
  }

  /** Обработчик ошибки */
  private error(error: unknown): void {
    this.messengerService.ShowException(error);
  }

  /** Загрузка */
  load = (): void => {
    this.loading.set(true);
    this.replacementRepository.get(this.employeeId()).subscribeWithDestroy({
      next: (items) => {
        this.replacements.update(items);
        this.loading.set(false);
      },
      error: (e: ProblemDetailApsNet) => {
        this.error(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  trackByFn = (index: number, item: Replacement): unknown => item.Id;
}

/** Замещение с датой */
class ReplacementWithDate {
  /** Замещение */
  Replacement = new Replacement();

  /** Дата */
  Date = new Date();
}
