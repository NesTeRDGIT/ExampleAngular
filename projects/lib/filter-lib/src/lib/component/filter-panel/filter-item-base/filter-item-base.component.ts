import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, effect, input, signal, untracked, } from "@angular/core";
import { FilterPanelComponent } from "../filter-panel.component";
import { FilterField } from "../../../model/FilterField";
import { Subject } from "rxjs";
import { FieldInfo } from "../../../model/FieldInfo";

@Component({
  selector: 'zms-filter-item-base',
  template: '<div></div>',
  host: { class: 'filter-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class FilterItemBaseComponent<T = unknown> implements OnInit, OnDestroy {
  owner: FilterPanelComponent


  constructor(owner: FilterPanelComponent) {
    this.owner = owner;

    this.setDefault();
  }

  ngOnDestroy(): void {
    this.effect.destroy();
    this.owner.removeFilterItem(this as FilterItemBaseComponent);
  }

  ngOnInit(): void {
    this.owner.addFilterItem(this as FilterItemBaseComponent);
    this.setDefault();
  }

  /** Заголовок */
  header = input("");

  /** Поле для фильтрации */
  field = input.required<string[], string | string[]>({
    transform: (value: string | string[]) => {
      if (typeof value == "string") {
        return value.split("|").map(x => x.trim());
      }
      return value;
    }
  });

  /** Значение фильтра по умолчанию */
  default = input<FieldInfo[], unknown>([], {
    transform: (value: unknown) => {
      if (Array.isArray(value)) {
        const field = this.field();
        return value.map((x, index) => new FieldInfo(index < this.field.length ? field[index] : '', x));
      } else {
        return [new FieldInfo('', value)]
      }
    }
  });

  /** Признак фильтра обязательно к заполнение */
  required = input(false);

  /** Признак фильтрации как отдельный компонент
   * Т.е. при обработке фильтра ServerSide будет указано отдельное значение с именем параметра name
   */
  singleUrl = input(false);

  /** Значение */
  value = signal<T | null>(null);

  value$ = new Subject<T | null>();

  private effect = effect(() => {
    const value = this.value();
    untracked(() => this.value$.next(value));
  });

  /** Установить значение по умолчанию */
  setDefault = (): void => {
    const def = this.default();
    if (def.length !== 0) {
      this.value.set(def[0].value as T);
    }
  }

  /** Очистить фильтр */
  abstract clearFilter: () => void;

  /** Указано ли значение в компоненте */
  abstract hasValue: () => boolean;

  /** Получить значение фильтра */
  abstract getFilterField: () => FilterField[]
}
