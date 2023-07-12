/** Информация о фильтрации */
export class FieldInfo {

  constructor(name: string, value: unknown) {
    this.name = name;
    this.value = value;
  }

  /** Наименование поля */
  name: string;

  /** Значение */
  value: unknown;
}
