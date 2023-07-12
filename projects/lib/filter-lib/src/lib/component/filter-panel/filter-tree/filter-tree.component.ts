import { TreeNode } from './TreeNode';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';


@Component({
  selector: 'zms-filter-tree',
  templateUrl: './filter-tree.component.html',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterTreeComponent) }],
  host: { class: 'filter-tree' }
})
export class FilterTreeComponent extends FilterItemBaseComponent<unknown[]> implements OnInit {

  _nodes: TreeNode[] = [];
  /** Дерево выбора */
  @Input() set nodes(value: TreeNode[]) {
    this._nodes = value;
    this.setDefault();
  }
  get nodes(): TreeNode[] {
    return this._nodes;
  }

  _selected: TreeNode[] = [];
  /** Выбранные элементы */
  set selectedNode(selected: TreeNode[]) {
    if (this._selected !== selected) {
      this._selected = selected;
      this.value = selected.map(x => x.data);
    }
  }
  get selectedNode(): TreeNode[] {
    return this._selected;
  }

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if (this.value == undefined) {
      this.value = [];
    }
  }

  ngOnInit(): void {
    if (this.field) {
      this.filter = FilterField.Create(this.field, TypeComparer.in, this.custom, this.name, this.singleUrl);
      this.owner.filters.push(this.filter)
    }
    this.setDefault();
  }

  commitFilter = () => {
    if (this.filter) {
      this.filter.value = this.value;
    }
  }

  rollbackFilter = () => {
    if (this.filter && Array.isArray(this.filter.value)) {
      this.value = this.filter.value;
    } else {
      this.value = [];
      this._selected = [];
    }
  };

  clearFilter = () => {
    if (this.filter) {
      this.filter.value = this.value = [];
      this._selected = [];
    }
  }

  hasValue = (): boolean => {
    if (this.value == undefined) {
      return false;
    } else {
      return this.value.length !== 0;
    }
  }

  /** Установить значение по умолчанию */
  setDefault = () => {
    if (this.default !== undefined) {
      /** В массив значений */
      if (!Array.isArray(this.default)) {
        this.default = [this.default];
      }
      /** Если варианты уже установленны */
      if (this.nodes.length != 0) {
        this.value = [];
        const selected: TreeNode[] = []
        for (const opt of this.getAllItemFromNode(this.nodes)) {
          const value = opt.data;
          if (value != undefined) {
            for (const defItem of this.default) {
              if (defItem == value) {
                selected.push(opt);
              }
            }
          }
        }

        this.selectedNode = selected;
      } else {
        this.value = this.default;
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
