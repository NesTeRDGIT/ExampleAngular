import { ChangeDetectionStrategy, Component, effect, OnDestroy, input, untracked, signal } from '@angular/core';
import { ComponentVisible, MessengerService, ObservableDestroyer, ProblemDetailApsNet, success } from '@shared-lib';
import { firstValueFrom } from 'rxjs';
import { WorkPeriodRepository } from '@EmployeeModuleRoot/service/repository/workPeriod.repository';
import { WorkPeriod } from '@EmployeeModuleRoot/model/WorkPeriod';
import { TableSelection, MenuItem } from '@components-lib';

@Component({
  selector: 'zms-work-period-manager',
  templateUrl: './work-period-manager.component.html',
  styleUrls: ['./work-period-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPeriodManagerComponent implements OnDestroy {

  constructor(
    private repo: WorkPeriodRepository,
    private messengerService: MessengerService) {

    effect(() => {
      const employeeId = this.employeeId();
      if (employeeId !== 0) {
        untracked(() => this.load());
      }
    });
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Указатель на сотрудника */
  employeeId = input(0);

  /** Только для чтения */
  readonly = input(false);

  /** Список периодов работы */
  items = signal<WorkPeriod[]>([]);

  /** Выбранные элементы */
  selection = new TableSelection<WorkPeriod>();

  /** Процесс загрузки */
  loading = signal(false);

  onContextMenuSelect() : void {
    const selectItems = this.selection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];
      const menuItems: MenuItem[] = [];
      menuItems.push({ label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', command: () => { this.onEditClick(firstItem); } });
      menuItems.push({ separator: true });
      menuItems.push({ label: 'Удалить', styleClass: 'red-menuitem', icon: 'google-symbol close', command: () => { this.onRemoveClick(selectItems) } });
      this.selection.contextMenuItems.set(menuItems);
    }
  }

  /** Загрузка мест работы */
  load = () : void => {
    this.loading.set(true);
    this.repo.get(this.employeeId()).subscribeWithDestroy({
      next: data => {
        this.items.set(data);
        this.selectedDefault();
        this.loading.set(false);
      },
      error: (error: ProblemDetailApsNet) => {
        this.messengerService.ShowException(error);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  /** Видимость окна редактора */
  workPeriodEditVisible = new ComponentVisible<WorkPeriod>(new WorkPeriod());

  /** Обработчик команды добавления */
  onDblClick = (item: WorkPeriod) : void => {
    if (!this.readonly) {
      this.onEditClick(item);
    }
  }

  /**Обработчик команды добавления */
  onAddClick = () : void => {
    const workPeriod = new WorkPeriod();
    workPeriod.Id = this.employeeId();
    this.workPeriodEditVisible.show(workPeriod);
  }

  /**Обработчик команды добавления */
  onEditClick = (item: WorkPeriod) : void => {
    this.workPeriodEditVisible.show(item);
  }

  /**Обработчик команды удаления ученной степени */
  onRemoveClick = (items: WorkPeriod[]) : void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          for (const item of items) {
            await firstValueFrom(this.repo.remove(item.EmployeeId, item.Id));
          }
          this.messengerService.ShowSuccess(`${items.length} периодов удалено`);
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.load();
          this.loading.set(false);
        }
      }
    }, this.destroyer$);
  }

  /** Событие закрытия */
  onClose = () : void => {
    this.workPeriodEditVisible.hide();
  }

  /** Событие изменения данных о периоде работы */
  onChanged = () : void => {
    this.load();
  }

  /** Установка выбора на элементе по умолчанию */
  private selectedDefault() : void {
    const items = this.items();
    if (items.length !== 0) {
      this.selection.selectedItems.set([items[0]]);
    }
  }
}
