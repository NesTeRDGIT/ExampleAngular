import { ComponentVisible, ObservableDestroyer, success } from '@shared-lib';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { Workplace } from '@EmployeeModuleRoot/model/dictionary/Workplace';
import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MessengerService, ProblemDetailApsNet } from '@shared-lib';
import { DictionaryRepository } from '@EmployeeModuleRoot/service/repository/dictionary.repository';
import { WorkplaceRepository } from '@EmployeeModuleRoot/service/repository/workplace.repository';
import { firstValueFrom } from 'rxjs';
import { TableSelection, TreeNode } from '@components-lib';

@Component({
  selector: 'zms-workplace-manager',
  templateUrl: './workplace-manager.component.html',
  styleUrls: ['./workplace-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplaceManagerComponent implements OnInit, OnDestroy {

  constructor(
    private dictionaryRepository: DictionaryRepository,
    private workplaceRepository: WorkplaceRepository,
    public dictionaryService: DictionaryService,
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

  /** Элементы */
  items = signal<TreeNode<Workplace>[]>([]);

  /** Выбранные элементы */
  selection = new TableSelection<TreeNode<Workplace>>();

  onContextMenuSelect(): void {
    const selectItems = this.selection.getSelectionAll();

    if (selectItems != null && selectItems.length != 0) {
      const firstItem = selectItems[0];
      this.selection.setContextMenu(menuItems => {
        menuItems.push({ label: 'Редактировать', icon: 'google-symbol edit', styleClass: 'bold-menuitem', command: () => { this.onEditClick(firstItem); } });
        menuItems.push({ label: 'Добавить дочернюю запись', icon: 'google-symbol edit', command: () => { this.onAddClick(firstItem) } });
        menuItems.push({ label: 'Переместить', icon: 'google-symbol swap_horiz', command: () => { this.onMoveClick(selectItems) } });
        menuItems.push({ separator: true });
        menuItems.push({ label: 'Удалить', icon: 'google-symbol close', styleClass: 'red-menuitem', command: () => { this.onRemoveClick(selectItems) } });
      });
    }
  }

  /** Баг PrimeNG selection не массив */
  onSelectionChange = (items: any): void => {
    if (items == null) {
      this.selection.selectedItems.set([]);
    } else {
      if (Array.isArray(items)) {
        this.selection.selectedItems.set([...items]);
      } else {
        this.selection.selectedItems.set([items]);
      }
    }
  }

  workplaceEditVisible = new ComponentVisible<WorkplaceWithParent>({ item: undefined, parent: undefined });

  onEditClick = (item: TreeNode<Workplace>): void => {
    this.workplaceEditVisible.show({ item: item.data, parent: item.parent?.data });
  }

  onAddClick = (parent: TreeNode<Workplace> | null = null): void => {
    const workplace = new Workplace();
    workplace.ParentId = parent?.data?.Value ?? 0;
    this.workplaceEditVisible.show({ item: workplace, parent: parent?.data });
  }

  moveVisible = new ComponentVisible<Workplace[]>([]);
  onMoveClick = (items: TreeNode<Workplace>[]): void => {
    this.moveVisible.show(items.filter(x => x.data !== undefined).map(x => x.data!));
  }

  onCloseMove = (): void => {
    this.moveVisible.hide();
    this.moveVisible.value.set([]);
  }

  onMoveTargeSelect = async (parent: WorkplaceTreeNode | null): Promise<void> => {
    if (parent) {
      this.moveVisible.hide();
      const workplaces = this.moveVisible.value();
      try {
        this.loading.set(true);
        for (const workplace of workplaces) {
          workplace.ParentId = parent.Item.Value;
          await firstValueFrom(this.workplaceRepository.update(workplace));
        }
      }
      catch (e: unknown) {
        this.messengerService.ShowException(e);
      } finally {
        this.loading.set(false);
        this.dictionaryService.WorkplaceTree.reset();
        this.load();
      }
    }
  }

  onRemoveClick = (items: TreeNode<Workplace>[]): void => {
    this.messengerService.ShowConfirm(`Вы уверены, что хотите удалить ${items.length} записей?`).pipe(success()).subscribeWithDestroy({
      next: async () => {
        try {
          const uniqueId = [...new Set(items.filter(x => x.data instanceof Workplace).map(x => (x.data as Workplace).Value))];
          this.loading.set(true);
          for (const employeeId of uniqueId) {
            await firstValueFrom(this.workplaceRepository.remove(employeeId))
          }
          this.messengerService.ShowSuccess(`${items.length} записей удалено`);
        }
        catch (e: unknown) {
          this.messengerService.ShowException(e);
        } finally {
          this.loading.set(false);
          this.dictionaryService.WorkplaceTree.reset();
          this.load();
        }
      }
    }, this.destroyer$);
  }

  onCloseEdit = (): void => {
    this.workplaceEditVisible.hide();
  }

  onModelChange = (): void => {
    this.load();
    this.dictionaryService.WorkplaceTree.reset();
  }

  /** Обработчик ошибки */
  private error(error: unknown): void {
    this.messengerService.ShowException(error);
  }

  /**Загрузка эксперта */
  load = (): void => {
    this.loading.set(true);
    this.dictionaryRepository.getWorkplaceTreeNode().subscribeWithDestroy({
      next: (items) => {
        this.items.set(this.convertToTree(items));
        this.loading.set(false);
      },
      error: (e: ProblemDetailApsNet) => {
        this.error(e);
        this.loading.set(false);
      }
    }, this.destroyer$);
  }

  private convertToTree = (items: WorkplaceTreeNode[], parent?: TreeNode<Workplace>): TreeNode<Workplace>[] => {
    const result: TreeNode<Workplace>[] = [];
    items.forEach(element => {
      const node: TreeNode<Workplace> = {
        data: element.Item,
        parent: parent
      }
      node.children = this.convertToTree(element.Children, node);
      result.push(node)
    });
    return result;
  }
}

interface WorkplaceWithParent {
  item: Workplace | undefined;
  parent: Workplace | undefined;
}
