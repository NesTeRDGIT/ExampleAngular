/** Параметр Url */
export class UrlParameter {

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value
  }

  /** Наименование параметра */
  name: string

  /** Значение параметра */
  value: string
}
