import { TypeComparer } from './TypeComparer'
import { InvalidCastException } from '@shared-lib'

/** Поле фильтрации */
export class FilterField {

  /**
   *
   * @param field Поле фильтрации
   * @param typeComparer тип сравнения
   * @param custom признак пользовательского
   * @param key - ключ
   * @param singleUrl - признак отдельного Url
   * @param value - Значение
   */
  private constructor(field: string[], typeComparer: TypeComparer, custom: boolean, key: string, singleUrl: boolean, value: unknown = null) {
    this.field = field;
    this.typeComparer = typeComparer;
    switch (typeComparer) {
      case TypeComparer.between:
      case TypeComparer.in: this.value = []; break;
      default:
        this.value = null;
    }
    this.key = key;
    this.singleUrl = singleUrl;
    this.custom = custom;
    if (value != null) {
      this.value = value;
    }
  }

  /** Наименование поля */
  field: string[] = [];

  /** Тип сравнения */
  typeComparer: TypeComparer = TypeComparer.after;

  /** Значение */
  value: unknown[] | unknown = [];

  /** Ключ */
  key = "";

  /** Признак пользовательского фильтра(т.е. метка что создано  пользователем) */
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
      return this.value !== null && this.value !== "" || this.custom;
    }
  }

  /** Получить массив значений */
  get arrayValue(): unknown[] {
    if (Array.isArray(this.value))
      return this.value;
    throw new InvalidCastException(this.value, 'Array');
  }

  /** Получить одиночное значение */
  get singleValue(): unknown {
    if (!Array.isArray(this.value))
      return this.value;
    throw new InvalidCastException(this.value, 'unknown');
  }


  /** Создать поле фильтрации
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param custom - признак пользовательского фильтра
   * @param name - наименование
   * @param singleUrl - Признак фильтрации как отдельный компонент
   * @param value - значение
   * @returns
   */
  static Create = (field: string[], typeComparer: TypeComparer, custom: boolean, key: string, singleUrl: boolean, value: unknown = null): FilterField => {
    return new FilterField(field, typeComparer, custom, key, singleUrl, value);
  }


  /** Создать поле фильтрации по умолчанию
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param value - значение
   * @returns
   */
  static CreateDefault = (field: string[] | string, typeComparer: TypeComparer, value: unknown = null): FilterField => {
    const fields = typeof field == 'string' ? [field] : field;
    return new FilterField(fields, typeComparer, false, "", false, value);
  }

  /** Создать поле фильтрации пользовательского фильтра
   * @param field - имя поля
   * @param field - имя
   * @param typeComparer - тип сравнения
   * @param value - значение
   * @returns
   */
  static CreateCustom = (field: string[] | string, typeComparer: TypeComparer, value: unknown = null, key = ''): FilterField => {
    const fields = typeof field == 'string' ? [field] : field;
    return new FilterField(fields, typeComparer, true, key, false, value);
  }

  /** Создать поле фильтрации пользовательского фильтра
 * @param field - имя поля
 * @param field - имя
 * @param typeComparer - тип сравнения
 * @param value - значение
 * @returns
 */
  static CreateCustomGeneric = <T>(field: string[] | string, typeComparer: TypeComparer, value: T, key = '') : FilterField => {
    const fields = typeof field == 'string' ? [field] : field;
    return new FilterField(fields, typeComparer, true, key, false, value);
  }

  /** Создать поле фильтрации как отдельный компонент
   * @param field - имя поля
   * @param typeComparer - тип сравнения
   * @param name - наименование
   * @param value - значение
   * @returns
   */
  static CreateSingleUrl = (field: string[] | string, typeComparer: TypeComparer, value: unknown = null) : FilterField => {
    const fields = typeof field == 'string' ? [field] : field;
    return new FilterField(fields, typeComparer, false, '', true, value);
  }
}
