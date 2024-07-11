import { TreeNode } from './TreeNode';
import { ChangeDetectionStrategy, Component, effect, forwardRef, input, signal, untracked } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';


@Component({
  selector: 'zms-filter-tree',
  templateUrl: './filter-tree.component.html',
  styleUrl: './filter-tree.component.scss',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterTreeComponent) }],
  host: { class: 'filter-tree' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTreeComponent extends FilterItemBaseComponent<unknown[]> {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if (this.value() == undefined) {
      this.value.set([]);
    }

    effect(() => {
      const nodes = this.nodes();
      if(nodes.length !== 0) {
        untracked(this.setDefault);
      }
    })
  }

  /** Дерево выбора */
  nodes = input<TreeNode[]>([]);

  /** Выбранные элементы */
  selectedNode = signal<TreeNode[]>([]);

  changeSelectedNode = (selected: TreeNode[]) : void => {
    if (this.selectedNode() !== selected) {
      this.selectedNode.set(selected);
      this.value.set(selected.map(x => x.data));
    }
  }

  clearFilter = () : void => {
    this.changeSelectedNode([]);
  }

  hasValue = (): boolean => {
    const value = this.value();
    if (value == undefined) {
      return false;
    } else {
      return value.length !== 0;
    }
  }

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.in, false, '', this.singleUrl(), this.value())];
  }

  /** Установить значение по умолчанию */
  override setDefault = () : void => {
    const def = this.default();
    const defaultItems = def.flatMap(x => Array.isArray(x.value) ? x.value : [x.value]);
    const nodes = this.nodes();
    if (defaultItems.length != 0) {
      /** Если варианты уже установленны */
      if (nodes.length != 0) {
        this.value.set([]);
        const selected: TreeNode[] = []
        for (const opt of this.getAllItemFromNode(nodes)) {
          const value = opt.data;
          if (value != undefined) {
            for (const defItem of defaultItems) {
              if (defItem == value) {
                selected.push(opt);
              }
            }
          }
        }
        this.changeSelectedNode(selected);
      } else {
        this.value.set(defaultItems);
      }
    }
  }

  /** Получить все элементы из дерева, в виде массива */
  private getAllItemFromNode = (items: TreeNode[]): TreeNode[] => {
    if (items.length == 0) {
      return [];
    } else {
      return items.concat(items.flatMap(x => this.getAllItemFromNode(x.children)));
    }
  }
}
