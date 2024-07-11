import { Component, signal, ChangeDetectionStrategy, input, model } from '@angular/core';
import { AutoCompleteSearchEvent } from '@components-lib';
import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';

@Component({
  selector: 'zms-workplace-part-select',
  templateUrl: './workplace-part-select.component.html',
  styleUrls: ['./workplace-part-select.component.scss'],
  host: {
    class: 'zms-workplace-part-select'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplacePartSelectComponent {
  /** Варианты */
  items = input<WorkplaceTreeNode[]>();

  /** Отображаемые варианты */
  visibleItems = signal<WorkplaceTreeNode[]>([]);

  /** Выбранное значение */
  current = model<WorkplaceTreeNode | null>(null);

  ngModelChange = (value: WorkplaceTreeNode | null) : void => {
    this.current.set(value);
  }

  /** Событие поиска */
  onSearch(event: AutoCompleteSearchEvent) : void {
    const query = event.query.toUpperCase();
    const items = this.items() ?? [];
    this.visibleItems.set(items.filter(x => x.Item.Name.toUpperCase().includes(query)));
  }
}