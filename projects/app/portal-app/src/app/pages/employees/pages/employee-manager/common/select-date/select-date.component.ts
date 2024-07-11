
import { Component, Output, EventEmitter, ChangeDetectionStrategy, input, signal, effect, untracked } from '@angular/core';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';

@Component({
  selector: 'zms-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDateComponent {

  constructor(public dictionaryService: DictionaryService) {
    effect(() => {
      const inputDate = this.date();
      untracked(() => this.model.set(inputDate));
    });
  }

  /** Дата */
  date = input<Date | null>(null);

  /** Модель */
  model = signal<Date | null>(null);

  /** Событие выбора */
  @Output() selectChange = new EventEmitter<Date>();

  onSelect = () : void => {
    const model = this.model();
    if (model !== null) {
      this.selectChange.emit(model);
    }
  }
}
