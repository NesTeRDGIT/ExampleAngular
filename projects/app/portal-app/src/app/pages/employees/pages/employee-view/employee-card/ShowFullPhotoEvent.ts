import { EmployeePhoto } from '@EmployeeModuleRoot/model/EmployeePhoto';

/** Событие просмотра фото */
export class ShowFullPhotoEvent {
  constructor(photos: EmployeePhoto[], selectIndex: number) {
    this.photos = photos;
    this.selectIndex = selectIndex;
  }

  /** Фотографии */
  photos: EmployeePhoto[];

  /** Выбранный элемент */
  selectIndex: number;
}
