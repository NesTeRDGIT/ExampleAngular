

import { ArgumentNullException, CheckPropertyService } from '@shared-lib';

/** Интервал времени */
export class TimeInterval {

  /** Время начала */
  TimeStart = "";

  /** Время окончания */
  TimeEnd = "";

  toString = () => {
    return `${this.TimeStart}:${this.TimeEnd}`;
  }

  static Create(source: any): TimeInterval {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new TimeInterval();
    const errField = CheckPropertyService.CheckProperty(dest, source, ['toString']);

    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }

    dest.TimeStart = String(source.TimeStart);
    dest.TimeEnd = String(source.TimeEnd);
    return dest;
  }
}
