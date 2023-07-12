import { InvalidCastException, UrlService } from '@shared-lib';
import { Injectable } from "@angular/core";
import { FilterField } from "../model/FilterField";
import { TypeComparer } from "../model/TypeComparer";
import { FieldInfo } from "../model/FieldInfo";
import { UrlParameter } from '../class/UrlParameter';

/** Сервис для фильтрации */
@Injectable({ providedIn: 'root' })
export class UrlFilterService {

  private readonly parameterName = 'filter';

  constructor(private urlService: UrlService) { }


  /** Получить параметры фильтра из Url
   * @param nameParameter - Имя параметра для стандартных фильтров
   */
  fromUrl(): FieldInfo[] {
    const findParameter = this.urlService.getParameter(this.parameterName);
    if (findParameter) {
      const params = findParameter.split(" and ").filter(x => x !== undefined && x !== "")
      return params.map(x => this.parseField(x));
    }
    return [];
  }

  /** Получить список параметров URL по filterList
   * @param filterList  - Список фильтров
   * @param nameParameter - Имя параметра для стандартных фильтров
   */
  toUrlParameters = (filterList: FilterField[]): UrlParameter[] => {
    const filterFields = filterList.filter(x => x.hasValue && x.singleUrl == false);
    const singleUrlFields = filterList.filter(x => x.singleUrl == true);
    if (filterFields.length === 0 && singleUrlFields.length == 0) {
      return [];
    }

    const arrayCondition: string[] = [];
    filterFields.forEach(field => {
      arrayCondition.push(this.getFieldCondition(field));
    });

    const result: { name: string, value: string }[] = [];
    if (arrayCondition.length != 0) {
      result.push({ name: this.parameterName, value: arrayCondition.join(" and ") });
    }

    singleUrlFields.forEach(x => {
      result.push({ name: x.name, value: this.getValue(x, false) });
    });
    return result;
  }

  /** Очистить Url */
  clearUrl = () => {
    this.urlService.changeUrlParameter('', this.parameterName);
  }

  /** Получить выражение из условия
   * @param field - условие
   */
  private getFieldCondition = (field: FilterField): string => {
    const arrayCondition: string[] = [];
    field.field.forEach(f => {
      arrayCondition.push(`${f} ${this.getOperation(field)} ${this.getValue(field)}`);
    });

    if (arrayCondition.length == 1) {
      return arrayCondition[0];
    } else {
      return `(${arrayCondition.join(" or ")})`;
    }
  }

  /** Получить строковое значение оператора
   * @param field - условие
   */
  private getOperation = (field: FilterField): string => {
    switch (field.typeComparer) {
      case TypeComparer.gt: return "GT";
      case TypeComparer.dateAfter: return "GT";
      case TypeComparer.after: return "GT";
      case TypeComparer.gte: return "GTE";
      case TypeComparer.lt: return "LT";
      case TypeComparer.dateBefore: return "LT";
      case TypeComparer.before: return "LT";
      case TypeComparer.lte: return "LTE";
      case TypeComparer.equals: return "EQ";
      case TypeComparer.is: return "EQ";
      case TypeComparer.dateIs: return "EQ";
      case TypeComparer.notEquals: return "NEQ";
      case TypeComparer.dateIsNot: return "NEQ";
      case TypeComparer.isNot: return "NEQ";
      case TypeComparer.contains: return "LIKE";
      case TypeComparer.startsWith: return "START";
      case TypeComparer.in: return "IN";
      case TypeComparer.between: return 'BETWEEN'
      case TypeComparer.endsWith:
      case TypeComparer.notContains:
      default:
        throw Error(`Операция ${field.typeComparer} не поддерживается для перевода в Url`)
    }
  }

  /** Получить строковое значение значение
   * @param field - условие
   * @param quotesString - заключать ли строки в кавычки
   */
  private getValue = (field: FilterField, quotesString = true): string => {
    if (Array.isArray(field.value)) {
      return field.arrayValue.map(x => this.valueToString(x)).join(",")
    } else {
      return this.valueToString(field.value, quotesString);
    }
  }

  /** Значение в строку
   * @param value - значение
   * @param quotesString - заключать ли строки в кавычки
   */
  private valueToString = (value: unknown, quotesString = true): string => {
    if (typeof value == 'number') {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.ToOnlyDateString();
    }
    if (typeof value == 'string') {
      if (quotesString) {
        return encodeURIComponent(`'${value.toString()}'`);
      } else {
        return encodeURIComponent(value.toString());
      }
    }
    if (typeof value == 'boolean') {
      return value ? "true" : "false"
    }

    if(value == null) {
      return "";
    }

    throw new InvalidCastException();


  }

  /** Разобрать поле
   * @param query - строка запроса
   */
  private parseField(query: string): FieldInfo {
    let curPos = 0;
    let buffer = "";
    const values: string[] = [];
    while (curPos < query.length) {
      const char = query[curPos];
      if (char == "'") {
        curPos++;
        const value = this.readStringValue(query, curPos);
        curPos = value.curPos;
        buffer += value.value;
        continue;
      }
      if (char == " ") {
        values.push(buffer);
        buffer = "";
        curPos++;
        continue;
      }
      if (char == "(" || char == ")") {
        curPos++;
        continue;
      }

      buffer += query[curPos];
      curPos++;
    }

    if (buffer != "") {
      values.push(buffer);
    }

    if (values.length >= 3) {
      const splitValue = values[2].split(',');

      if (splitValue.length == 1) {
        return new FieldInfo(values[0], values[2]);
      } else {
        return new FieldInfo(values[0], splitValue);
      }
    }
    throw new Error("Ошибка разбора выражения")
  }

  /** Прочитать строковое значение */
  private readStringValue(query: string, curPos: number): { value: string, curPos: number } {
    let buffer = "";
    while (curPos < query.length) {
      const char = query[curPos];
      if (char == "'") {
        curPos++;
        break;
      }
      buffer += query[curPos];
      curPos++;
    }
    return { value: buffer, curPos: curPos };
  }
}
