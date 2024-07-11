import { ChangeDetectionStrategy, Component, effect, forwardRef, input, untracked } from '@angular/core';
import { FilterPanelComponent } from '../filter-panel.component';
import { FilterField } from '../../../model/FilterField';
import { FilterItemBaseComponent } from '../filter-item-base/filter-item-base.component';
import { TypeComparer } from '../../../model/TypeComparer';


@Component({
  selector: 'zms-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrl: './filter-select.component.scss',
  providers: [{ provide: FilterItemBaseComponent, useExisting: forwardRef(() => FilterSelectComponent) }],
  host: { class: 'filter-select' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSelectComponent extends FilterItemBaseComponent<unknown[]> {

  constructor(owner: FilterPanelComponent) {
    super(owner);
    if (this.value() == undefined) {
      this.value.set([]);
    }

    effect(() => {
      const options = this.options();
      if (options.length !== 0) {
        untracked(this.setDefault);
      }
    });
  }

  /** Варианты для выбора */
  options = input<unknown[]>([]);

  /** Поля для отображение */
  optionLabel = input("");

  /** Поле для значения */
  optionValue = input("");

  getFilterField = (): FilterField[] => {
    return [FilterField.Create(this.field(), TypeComparer.in, false, '', this.singleUrl(), this.value())];
  }

  clearFilter = () : void => {
    this.value.set([]);
  }

  hasValue = (): boolean => {
    const value = this.value();
    if (value) {
      return value.length !== 0;
    } else {
      return false;
    }
  }

  /** Установить значение по умолчанию */
  override setDefault = () : void => {
    const def = this.default();
    const defaultItems = def.flatMap(x => Array.isArray(x.value) ? x.value : [x.value]);

    if (defaultItems.length !== 0) {

      const options = this.options();
      const optionValue = this.optionValue();
      /** Если варианты уже установленны */
      if (options.length != 0) {
        const optionsItems = options.map(opt => (opt as any)[optionValue]);
        const newValue: unknown[] = [];
        optionsItems.forEach(opt => {
          for (const def of defaultItems) {
            if (def == opt) {
              newValue.push(opt);
              break;
            }
          }
        });
        /** Ставим значения присутствующие в вариантах */
        this.value.set(newValue);
      } else {
        /** Ставим значения по умолчанию */
        this.value.set(defaultItems);
      }
    }
  }

}
