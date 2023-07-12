/** Тип сравнения */
export enum TypeComparer {

  /** Начинается с */
  startsWith = "startsWith",

  /** Содержит */
  contains = "contains",

  /** Не содержит */
  notContains = "notContains",

  /** Заканчивается на */
  endsWith = "endsWith",

  /** Соответствует  */
  equals = "equals",

  /** Не соответствует */
  notEquals = "notEquals",

  /** В списке */
  in = "in",

  /** Между */
  between = "between",

  /** Меньше */
  lt = "lt",

  /** Меньше или равно */
  lte = "lte",

  /** Больше */
  gt = "gt",

  /** Больше или равно */
  gte = "gte",

  /** Соответствует */
  is = "is",

  /** Не соответствует */
  isNot = "isNot",

  /** До */
  before = "before",

  /** После */
  after = "after",

  /** Дата равна */
  dateIs = "dateIs",

  /** Дата не равна */
  dateIsNot = "dateIsNot",

  /** Дата до */
  dateBefore = "dateBefore",

  /** Дата после */
  dateAfter = "dateAfter",
}