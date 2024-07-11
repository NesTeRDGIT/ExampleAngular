import { FilterField } from "./FilterField";

/** Событие фильтрации */
export class FilterEvent {

  private _invokeType: FilterEventInvokeType = 'user';

  constructor(invokeType: FilterEventInvokeType) {
    this._invokeType = invokeType;
  }

  /** Поля фильтрации */
  fields: FilterField[] = []

  /** Тип вызова события */
  get invokeType(): FilterEventInvokeType {
    return this._invokeType;
  }
}

/** Тип вызова FilterEvent user - пользователем,  system - системой */
export type FilterEventInvokeType = 'user' | 'system';
