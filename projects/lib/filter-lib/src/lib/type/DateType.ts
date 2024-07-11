/** Тип данных дата, c флагом отправки времени */
export class DateType extends Date {

  constructor(value: Date, sendDate = false) {
    super(value);
    this.sendTime = sendDate;
  }

  /** Посылать ли время */
  sendTime = false;

  TruncTime = (): DateType => {
    return new DateType(super.TruncTime(), this.sendTime);
  }
}
