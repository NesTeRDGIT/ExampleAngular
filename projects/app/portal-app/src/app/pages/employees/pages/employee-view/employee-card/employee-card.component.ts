import { ShowFullPhotoEvent } from './ShowFullPhotoEvent';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output, input } from '@angular/core';
import { EmployeeCardItem } from '@EmployeeModuleRoot/model/EmployeeCardItem';
import { EmployeePhoto } from '@EmployeeModuleRoot/model/EmployeePhoto';
import { EmployeePhotoRepository } from '@EmployeeModuleRoot/service/repository/employeePhoto.repository';
import { MessengerService, ObservableDestroyer } from '@shared-lib';

@Component({
  selector: 'zms-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss',
  host: { class: 'zms-employee-card' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeCardComponent implements OnDestroy {
  constructor(
    public employeePhotoRepository: EmployeePhotoRepository,
    private messengerService: MessengerService) {
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Признак выделенного */
  selected = input(false);

  /** Данные */
  item = input(new EmployeeCardItem());

  /** Событие раскрытия фото */
  @Output() showFullPhoto = new EventEmitter<ShowFullPhotoEvent>();

  onClickImage = (photoId: number) : void => {
    const item = this.item();

    if (photoId !== 0) {
      this.employeePhotoRepository.get(item.Id).subscribeWithDestroy({
        next: photos => {
          if (photos.length !== 0) {
            const findIndex = this.findAvatarIndex(photos)
            this.showFullPhoto.emit(new ShowFullPhotoEvent(photos, findIndex));
          }
        },
        error: error => {
          this.messengerService.ShowException(error);
        }
      }, this.destroyer$);
    }
  }

  onKeyDown = (e: KeyboardEvent, photoId: number) : void => {
    if (e.key == 'Enter') {
      this.onClickImage(photoId);
    }
  }

  defaultPhoto = (): string => {
    const item = this.item();
    return item.Sex == 1 ? 'assets/noPhotoMan.jpeg' : 'assets/noPhotoWoman.jpeg';
  }

  /** Поиск индекса аватара в коллекции */
  private findAvatarIndex = (photos: EmployeePhoto[]) : number => {
    const item = this.item();

    const indexAvatar = photos.findIndex(x => x.Id === item.AvatarPhotoId);
    return indexAvatar == -1 ? 0 : indexAvatar;
  }
}
