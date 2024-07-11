import { Component, ViewChild, AfterViewInit, OnDestroy, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { MessengerService, ColumnParametersCollection, ArrayHelper, success, ObservableDestroyer, ComponentVisible } from '@shared-lib';
import { FilterEvent, FilterPanelComponent, FilterField, TypeComparer, TableLazyLoadService, BrowserQueryStringService, FilterServerSideCollection } from '@filter-lib';
import { EmployeeListItemRepository } from '@EmployeeModuleRoot/service/repository/employeeListItem.repository';
import { EmployeeRepository } from '@EmployeeModuleRoot/service/repository/employee.repository';
import { EmployeeListItem } from '@EmployeeModuleRoot/model/EmployeeListItem';
import { firstValueFrom } from 'rxjs';
import { authenticatedFeature } from '@authorization-lib';
import { Store } from '@ngrx/store';
import { TableComponent, TableSelection } from '@components-lib';

@Component({
  selector: 'zms-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeManagerComponent implements AfterViewInit, OnDestroy {

  @ViewChild("FilterPanel") FilterPanel?: FilterPanelComponent;
  @ViewChild("Table") Table?: TableComponent<unknown>;

  constructor(
    private employeeListItemRepository: EmployeeListItemRepository,
    private employeeRepository: EmployeeRepository,
    private messengerService: MessengerService,
    public dictionaryService: DictionaryService,
    private tableLazyLoadService: TableLazyLoadService,
    private store$: Store,
    private BrowserQueryStringService: BrowserQueryStringService) {
  }

  ngAfterViewInit(): void {
    this.tableLazyLoadService.applyQueryParameters(this.FilterPanel, this.Table);
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Профиль пользователя */
  userProfile = this.store$.selectSignal(authenticatedFeature.employeeProfile);

  /** Может ли редактировать справочники */
  canEditDictionary = computed(() => this.userProfile().Admin || this.userProfile().Writer);

  /** Может ли редактировать пользователей */
  canEdit = computed(() => this.userProfile().Admin || this.userProfile().Writer);

  /** Сохранить параметры колонок */
  saveColumns = (): void => {
    const columns = this.columns();
    columns.save();
  }

  /** Параметры колонок */
  columns = signal(new ColumnParametersCollection([], ''));

  /** В процессе загрузки */
  loading = signal(false);

  /** Сотрудники */
  employees = new FilterServerSideCollection<EmployeeListItem>([]);

  /** Выбранные элементы */
  selection = new TableSelection<EmployeeListItem>();

  /** Перенос строк */
  wrapMode = signal(true);

  onContextMenuSelect(): void {
    const selectItems = this.selection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];

      const canDelete = this.canEdit();
      this.selection.setContextMenu(menuItems => {
        menuItems.push({ label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', command: () => { this.onEditClick(firstItem.Id); } });
        menuItems.push({ separator: true });
        menuItems.push({ label: 'Удалить', icon: 'google-symbol close', styleClass: 'red-menuitem', disabled: !canDelete, command: () => { this.onDeleteClick(selectItems); } });
      });
    }
  }

  /** Видимость редактора сотрудников */
  editEmployeeVisible = new ComponentVisible(0);

  onEditClick = (employeeId: number): void => {
    this.editEmployeeVisible.show(employeeId);
  }

  /** Видимость создания сотрудников */
  createEmployeeVisible = new ComponentVisible(0);

  onCreateClick = (): void => {
    this.createEmployeeVisible.show(0);
  }

  /** Видимость управления местоположением */
  workplaceManagerVisible = new ComponentVisible(0);

  onShowWorkplaceManagerClick = (): void => {
    this.workplaceManagerVisible.show(0);
  }

  /** Видимость управления  отделами */
  departmentManagerVisible = new ComponentVisible(0);

  onShowDepartmentManagerClick = (): void => {
    this.departmentManagerVisible.show(0);
  }

  onDeleteClick = (items: EmployeeListItem[]): void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          const uniqueId = [...new Set(items.map(x => x.Id))];

          this.loading.set(true);
          for (const employeeId of uniqueId) {
            await firstValueFrom(this.employeeRepository.remove(employeeId))
          }
          this.messengerService.ShowSuccess(`${items.length} сотрудников удалено`);
          this.employees.mutate(employees => ArrayHelper.removeByKey(employees, uniqueId, x => x.Id));
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.loading.set(false);
        }
      }
    }, this.destroyer$);
  }

  onEditChange = (employeeId: number): void => {
    this.loadPart(employeeId);
  }

  onCreate = (employeeId: number): void => {
    this.onEditClick(employeeId);
    this.load(this.employees.filter().map(x => x));
  }

  onCloseCreate = (): void => {
    this.createEmployeeVisible.hide();
  }

  onCloseEdit = (): void => {
    this.editEmployeeVisible.hide();
  }


  onFilter = (e: FilterEvent): void => {
    this.load(e.fields);
  }

  private load = (filter: FilterField[]): void => {
    this.loading.set(true);
    this.employeeListItemRepository.get(filter).subscribeWithDestroy({
      next: (data) => {
        this.employees.update(data, filter);
        this.BrowserQueryStringService.writeToUrl(this.employees);
        this.loading.set(false);
      },
      error: (error) => {
        this.messengerService.ShowException(error);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  private loadPart = (employeeId: number): void => {
    const filter = FilterField.CreateDefault("Id", TypeComparer.equals);
    filter.value = employeeId;

    this.employeeListItemRepository.get([filter]).subscribeWithDestroy({
      next: (data) => {
        this.employees.mutate(employees => ArrayHelper.replaceByKey<EmployeeListItem>(employees, data, x => x.Id));
      },
      error: (error) => {
        this.messengerService.ShowException(error);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  trackByFn = (index: number, item: EmployeeListItem): number => item.Id;
}
