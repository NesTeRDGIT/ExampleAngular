import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';


export class SelectWorkplaceTreeNode {

  /** Выбранный элемент */
  selectItem: WorkplaceTreeNode | null = null;

  /** Варианты */
  children: WorkplaceTreeNode[] = [];

  /** Следующий выбор */
  next: SelectWorkplaceTreeNode | null = null;

  /** Получить список всех выбранных элементов */
  selectList = (): SelectWorkplaceTreeNode[] => {
    const result: SelectWorkplaceTreeNode[] = [];
    result.push(this);
    if (this.next) {
      result.push(...this.next.selectList());
    }
    return result;
  }

  last = (): WorkplaceTreeNode | null => {
    return this.next !== null && this.next.selectItem !== null ? this.next.last() : this.selectItem;
  }
}
