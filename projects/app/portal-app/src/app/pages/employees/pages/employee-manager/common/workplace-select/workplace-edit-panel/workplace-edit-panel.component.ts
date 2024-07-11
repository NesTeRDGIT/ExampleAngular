import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, Output, signal, untracked } from '@angular/core';
import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';
import { SelectWorkplaceTreeNode } from './SelectWorkplaceTreeNode'

@Component({
  selector: 'zms-workplace-edit-panel',
  templateUrl: './workplace-edit-panel.component.html',
  styleUrls: ['./workplace-edit-panel.component.scss'],
  host: {
    class: 'zms-workplace-edit-panel'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplaceEditPanelComponent {

  constructor() {
    effect(() => {
      const selectWorkplaceValue = this.selectWorkplaceValue() ?? 0;
      untracked(() => {
        this.setWorkplaceValue(selectWorkplaceValue ?? 0);
      });
    });

    effect(() => {
      const nodes = this.nodes();
      if (nodes) {
        untracked(() => {
          this.treeSelect.update(tree => {
            const root = tree[0];
            root.children = nodes;
            return tree;
          });
          this.setWorkplaceValue(this.selectWorkplaceValue() ?? 0);
        });
      }
    });
  }

  /** Указатель на сотрудника */
  nodes = input<WorkplaceTreeNode[]>();

  /** Выбранный элемент */
  selectWorkplaceValue = input<number>();

  /** Событие выбора адреса */
  @Output() accept = new EventEmitter<WorkplaceTreeNode | null>();

  /** Событие отмена */
  @Output() cancel = new EventEmitter<void>();

  /** Элементы для отображения */
  treeSelect = signal<SelectWorkplaceTreeNode[]>([new SelectWorkplaceTreeNode()], { equal: () => false });

  /** Событие изменения выбора */
  onCurrentChange = (current: WorkplaceTreeNode | null, select: SelectWorkplaceTreeNode) : void => {
    if (select.selectItem !== current) {
      select.selectItem = current;
      if (current && current.Children.length !== 0) {
        select.next = new SelectWorkplaceTreeNode();
        select.next.children = current.Children;
      } else {
        select.next = null;
      }
      this.updateTreeSelect();
    }
  }

  onCloseClick = () : void => {
    this.cancel.emit();
  }

  get root(): SelectWorkplaceTreeNode {
    return this.treeSelect()[0];
  }

  onAcceptClick = () : void => {
    this.accept.emit(this.root.last());
  }

  /** Обновить дерево выбора */
  private updateTreeSelect = () : void => {
    const root = this.treeSelect()[0];
    this.treeSelect.set(root.selectList());
  }

  /** Установить значение */
  private setWorkplaceValue(workplaceValue: number) : void {
    const path = this.findTreeByValue(this.root.children, workplaceValue);
    let select = this.root;
    for (const pathItem of path) {
      const findItem = select.children.find(x => x.Item.Value == pathItem);
      if (findItem) {
        select.selectItem = findItem;
        if (findItem.Children.length !== 0) {
          select.next = new SelectWorkplaceTreeNode();
          select.next.children = findItem.Children;
          select = select.next;
        }
      } else {
        break;
      }
    }
    this.updateTreeSelect();
  }

  /** Поиск в дереве */
  private findTreeByValue(items: WorkplaceTreeNode[], value: number): number[] {
    for (const item of items) {
      if (item.Item.Value == value) {
        return [item.Item.Value];
      } else {
        const childFind = this.findTreeByValue(item.Children, value);
        if (childFind.length !== 0) {
          return [item.Item.Value, ...childFind];
        }
      }
    }
    return [];
  }
}
