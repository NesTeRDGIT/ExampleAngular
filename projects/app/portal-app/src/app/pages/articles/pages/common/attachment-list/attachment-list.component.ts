import { untracked } from '@angular/core';
import { signal } from '@angular/core';
import { AttachmentViewModel } from '@ArticlesModuleRoot/viewModel/AttachmentViewModel';
import { AttachmentRepository } from '@ArticlesModuleRoot/services/repository/attachment.repository';
import { AfterContentInit, ChangeDetectionStrategy, Component, effect, input, OnDestroy } from '@angular/core';
import { ComponentVisible, MessengerService, ObservableDestroyer, ProblemDetailApsNet, success } from '@shared-lib';
import { Observable, concatMap, filter, from } from 'rxjs';
import { LoadState } from '@download-lib';
import { Attachment } from '@ArticlesModuleRoot/model/Attachment';
import { Collection } from '@filter-lib';

@Component({
  selector: 'zms-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentListComponent implements AfterContentInit, OnDestroy {
  constructor(private messengerService: MessengerService,
    private attachmentRepository: AttachmentRepository
  ) {
    effect(() => {
      const articleId = this.articleId();
      if (articleId !== 0) {
        untracked(() => this.load());
      }
    })
  }

  ngAfterContentInit(): void {
    this.load();
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Указатель статью */
  articleId = input(0);

  /** Только для чтения */
  readonly = input(false);

  /** Загрузка  */
  loading = signal(false);

  /** Вложения */
  attachments = new Collection<AttachmentViewModel>([]);

  onDownloadClick = (attachment: AttachmentViewModel) : void => {
    this.attachmentRepository.download(attachment.convert()).subscribeWithDestroy({
      error: (e) => this.messengerService.ShowException(e)
    }, this.destroyer$);
  }

  /** Просмотр PDF */
  pdfViewer = new ComponentVisible<IPdfViewValue>({ data: undefined, loadState: LoadState.Finish() }, { equal: () => false });
  pdfAttachment?: AttachmentViewModel;
  onShowPdfClick = (attachment: AttachmentViewModel) : void => {
    this.pdfViewer.show({ data: undefined, loadState: LoadState.Finish() });
    this.attachmentRepository.getData(attachment.convert(), (state) => {
      this.pdfViewer.value.update(v => {
        v.loadState = state;
        return v;
      });
    }).subscribeWithDestroy({
      next: b => {
        this.pdfViewer.value.update(v => {
          v.data = b;
          return v;
        });
      },
      error: e => {
        this.messengerService.ShowException(e);
        this.pdfViewer.hide();
      }
    }, this.destroyer$);
  }

  /** Скрыть PDF */
  onHidePdfClick = () : void => {
    this.pdfViewer.hide();
    this.pdfViewer.value.set({ data: undefined, loadState: LoadState.Finish() });
  }


  /** Просмотр картинки */
  photoViewer = new ComponentVisible<AttachmentViewModel[]>([]);
  imageRef = signal<string | undefined>(undefined);
  /** Просмотр картинки */
  onShowImageClick = (attachment: AttachmentViewModel) : void => {
    const items = [attachment];
    this.photoViewer.show(items);

    this.attachmentRepository.getData(attachment.convert(), (state) => {
      attachment.State = state;
      this.photoViewer.value.set([attachment]);
    }).subscribeWithDestroy({
      next: b => {
        this.imageRef.set(URL.createObjectURL(b));
      },
      error: e => {
        this.messengerService.ShowException(e);
        this.photoViewer.hide();
      }
    }, this.destroyer$);
  }

  /** Скрыть картинку */
  onHideImageClick = () : void => {
    this.imageRef.set(undefined);
  }

  /** Удалить вложение */
  onDeleteClick = (item: AttachmentViewModel) : void => {
    if (item) {
      if (item && item.Id != 0) {
        this.messengerService.ShowConfirm("Вы уверены что хотите удалить вложение?").pipe(success()).subscribeWithDestroy({
          next: () => {
            this.attachmentRepository.remove(item.convert()).subscribeWithDestroy({
              next: () => {
                this.attachments.mutate(attachments => {
                  attachments.splice(this.attachments.items().indexOf(item), 1);
                });
              },
              error: (e: ProblemDetailApsNet) => { this.error(e); }
            }, this.destroyer$);
          }
        }, this.destroyer$);
      } else {
        this.messengerService.ShowConfirm("Вы уверены что хотите удалить вложение?").pipe(success()).subscribeWithDestroy({
          next: () => {
            this.attachments.mutate(attachments => {
              attachments.splice(this.attachments.items().indexOf(item), 1);
            });
          }
        }, this.destroyer$)
      }
    }
  }

  /** Удалить вложение */
  onCopyUrlClick = (item: AttachmentViewModel) : void => {
    if (item) {
      const url = this.attachmentRepository.getUrl(item.Id);
      navigator.clipboard.writeText(url);
      this.messengerService.ShowSuccess("URL скопирован в буфер обмена");
    }
  }

  /** Добавление вложения */
  onFileSelected = (event: Event) : void => {
    const element = event.currentTarget as HTMLInputElement;
    const attachments = this.attachments.items();

    if (element.files) {
      const files = element.files;
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const vm = new AttachmentViewModel();
          vm.File = file;
          vm.Name = file.name;
          attachments.push(vm);
        }
      }
      this.attachments.update(attachments);
    }
  }

  /** Загрузить новые вложения на сервер */
  uploadAttachments = (articleId: number): Observable<void> => {
    return new Observable(sub => {
      from(this.attachments.items().filter(x => x.File != null)).pipe(
        filter(x => x.File != null),
        concatMap((attachment) => {
          return new Observable(sub => {
            this.attachmentRepository.add(articleId, attachment.File!).subscribeWithDestroy({
              next: state => {
                attachment.State = state;
                if (state.state == 'finish' && state.response != null) {
                  attachment.Id = state.response;
                }
                this.attachments.mutate(() => { null });
              },
              error: e => sub.error(e),
              complete: () => {
                sub.complete()
              }
            }, this.destroyer$);
          })
        })
      ).subscribeWithDestroy({
        complete: () => {
          sub.next();
          sub.complete();
        },
        error: (e) => sub.error(e)
      }, this.destroyer$);
    });
  }

  /** Добавить вложение */
  add = (attachment: Attachment) : void => {
    const attachments = this.attachments.items();
    const vm = new AttachmentViewModel();
    vm.update(attachment);
    attachments.push(vm);
    this.attachments.update(attachments);
  }

  /** Обработчик ошибки */
  private error(error: ProblemDetailApsNet) : void {
    this.messengerService.ShowException(error);
  }

  /** Загрузка */
  private load = () : void => {
    const articleId = this.articleId();
    if (articleId != 0) {
      this.loading.set(true);
      this.attachmentRepository.get(articleId).subscribeWithDestroy({
        next: (items) => {
          this.attachments.update(items.filter(x => x.Type.Value == '' || !this.readonly()).map(a => {
            const vm = new AttachmentViewModel();
            vm.update(a);
            return vm;
          }));
          this.loading.set(false);
        },
        error: (e: ProblemDetailApsNet) => {
          this.error(e);
          this.loading.set(false);
        }
      }, this.destroyer$)
    }
  }
}


interface IPdfViewValue {
  /** Данные */
  data: Blob | undefined,

  /** Статус загрузки */
  loadState: LoadState
}