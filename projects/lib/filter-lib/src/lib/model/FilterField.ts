import { TypeComparer } from './TypeComparer'
import { InvalidCastException } from '@shared-lib'

/** Поле фильтрации */
export class FilterField {

  private constructor(field: string, typeComparer: TypeComparer, custom: boolean, name: string, singleUrl: boolean, value: unknown = null) {

    this.field = field.split("|").map(x => x.trim());
    this.typeComparer = typeComparer;
    switch (typeComparer) {
      case TypeComparer.between:
      case TypeComparer.in: this.value = []; break;
      default:
        this.value = null;
    }
    this.name = name;
    this.singleUrl = singleUrl;
    this.custom = custom;
    if(value != null){
      this.value = value;
    }
  }

  /** Наименование поля */
  field: string[] = [];

  /** Тип сравнения */
  typeComparer: TypeComparer = TypeComparer.after;

  /** Значение */
  value: unknown[] | unknown = [];

  /** Наименование поля(Ключ) */
  name = "";

  /** Признак пользовательского фильтра */
  custom = false;

  /** Признак фильтрации как отдельный компонент
   * Т.е. при обработке фильтра ServerSide будет указано отдельное значение с именем параметра name
   */
  singleUrl = false;

  /** Присутствует ли значение */
  get hasValue(): boolean {
    if (Array.isArray(this.value)) {
      return this.value.length !== 0;
    } else {
      return this.value !== null && this.value !== "";
    }
  }

  /** Получить массив значений */
  get arrayValue(): unknown[] {
    if (Array.isArray(this.value))
      return this.value;
    throw new InvalidCastException();
  }

  /** Получить одиночное значение */
  get singleValue(): unknown {
    if (!Array.isArray(this.value))
      return this.value;
    throw new InvalidCastException();
  }


  /** Создать поле фильтрации
   *
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param custom - признак пользовательского фильтра
   * @param name - наименование
   * @param singleUrl - Признак фильтрации как отдельный компонент
   * @param value - значение
   * @returns
   */
  static Create = (field: string, typeComparer: TypeComparer, custom: boolean, name: string, singleUrl: boolean, value: unknown = null): FilterField => {
    return new FilterField(field, typeComparer,custom, name, singleUrl, value);
  }

  /** Создать поле фильтрации по умолчанию
   *
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param value - значение
   * @returns
   */
  static CreateDefault = (field: string, typeComparer: TypeComparer, value: unknown = null): FilterField => {
    return new FilterField(field, typeComparer, false, "", false, value);
  }

  /** Создать поле фильтрации пользовательского фильтра
   *
   * @param field - имя поля
   * @param field - имя
   * @param typeComparer - тип сравнения
   * @param value - значение
   * @returns
   */
  static CreateCustom = (field: string, typeComparer: TypeComparer, value: unknown = null,  name = '') => {
    return new FilterField(field, typeComparer, true, name, false, value);
  }

  /** Создать поле фильтрации как отдельный компонент
   *
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param name - наименование
   * @param value - значение
   * @returns
   */
  static CreateSingleUrl = (field: string, typeComparer: TypeComparer, name: string, value: unknown = null) => {
    return new FilterField(field, typeComparer, false, name, true, value);
  }
}
