import { EmployeePhoto } from '@EmployeeModuleRoot/model/EmployeePhoto';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, input, signal } from '@angular/core';
import { ComponentVisible, MessengerService, ObservableDestroyer, ProblemDetailApsNet, success } from '@shared-lib';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { EmployeePhotoRepository } from '@EmployeeModuleRoot/service/repository/employeePhoto.repository';

@Component({
  selector: 'zms-photos-editor',
  templateUrl: './photos-editor.component.html',
  styleUrls: ['./photos-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosEditorComponent implements OnInit, OnDestroy {
  constructor(
    public employeePhotoRepository: EmployeePhotoRepository,
    public dictionaryService: DictionaryService,
    private messengerService: MessengerService) {
  }

  ngOnInit(): void {
    this.load();
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  @ViewChild('InputFile') InputFile?: ElementRef<HTMLInputElement>;

  /** Указатель на сотрудника */
  employeeId = input(0);

  /** Только для чтения */
  readonly = input(false);

  /** Загрузка изображений */
  loading = signal(false);

  /** Загрузка изображения на сервер */
  uploading = signal(false);

  /** Прогресс загрузки */
  uploadProgress = signal(0);

  /** Фотографии */
  photos = signal<EmployeePhoto[]>([]);

  /** Просмотр в полноэкранном режиме */
  displayFullScreen = new ComponentVisible(0);

  onImageClick = (index: number) : void => {
    this.displayFullScreen.show(index);
  }

  onImageKeyDown = (e: KeyboardEvent, index: number) : void => {
    if (e.key == 'Enter') {
      this.onImageClick(index);
    }
  }

  onRemoveImageClick = (photo: EmployeePhoto) : void => {
    if (photo) {
      this.messengerService.ShowConfirm("Вы уверены что хотите удалить фото?").pipe(success()).subscribeWithDestroy({
        next: () => {
          this.employeePhotoRepository.remove(photo).subscribeWithDestroy({
            next: () => { this.load(); },
            error: (e: ProblemDetailApsNet) => { this.error(e); }
          }, this.destroyer$);
        }
      }, this.destroyer$);
    }
  }

  onRemoveImageKeyDown = (e: KeyboardEvent, photo: EmployeePhoto) : void => {
    if (e.key == 'Enter') {
      this.onRemoveImageClick(photo);
    }
  }

  onAddClick = () : void => {
    const input = this.InputFile?.nativeElement;
    if (input) {
      input.click();
    }
  }

  onAddKeyDown = (e: KeyboardEvent) : void => {
    if (e.key == 'Enter') {
      this.onAddClick();
    }
  }

  onFileSelected = (event: Event) : void => {
    const element = event.currentTarget as HTMLInputElement;
    if (element && !this.uploading()) {
      const file = element.files?.item(0);
      element.value = "";
      if (file) {
        this.uploadProgress.set(0);
        this.uploading.set(true);

        this.employeePhotoRepository.add(this.employeeId(), file).subscribeWithDestroy({
          next: (event) => {
            this.uploadProgress.set(event.progress);
            if (event.state == 'finish') {
              this.uploading.set(false);
              this.load();
            }
          },
          error: (e: ProblemDetailApsNet) => {
            this.error(e);
            this.uploading.set(false);
          }
        }, this.destroyer$);
      }
    }
  }

  /** Обработчик ошибки */
  private error(error: ProblemDetailApsNet) : void {
    this.messengerService.ShowException(error);
  }

  /** Загрузка */
  private load = () : void => {
    this.loading.set(true);
    this.employeePhotoRepository.get(this.employeeId()).subscribeWithDestroy({
      next: (photos) => {
        this.photos.set(photos);
        this.loading.set(false);
      },
      error: (e: ProblemDetailApsNet) => {
        this.error(e);
        this.loading.set(false);
      }
    }, this.destroyer$)
  }
}
