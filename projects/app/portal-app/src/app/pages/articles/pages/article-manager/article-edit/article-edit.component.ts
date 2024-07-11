import { ArticleViewModel } from '@ArticlesModuleRoot/viewModel/ArticleViewModel';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, OnDestroy, Output, signal, untracked, ViewChild } from '@angular/core';
import { MessengerService, ObservableDestroyer, ProblemDetailApsNet } from '@shared-lib';
import { ArticleRepository } from '@ArticlesModuleRoot/services/repository/article.repository';
import { AttachmentListComponent } from '@ArticlesModuleRoot/pages/common/attachment-list/attachment-list.component';
import { Observable } from 'rxjs';

import { AttachmentRepository } from '@ArticlesModuleRoot/services/repository/attachment.repository';
import { Attachment } from '@ArticlesModuleRoot/model/Attachment';
import { AttachmentType } from '@ArticlesModuleRoot/model/AttachmentType';
import { ProgressCallback, UploadFunction } from '@components-lib';
import { AttachmentLinkReplaceService } from '@ArticlesModuleRoot/services/attachmentLinkReplace.service';

@Component({
  selector: 'zms-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleEditComponent implements OnDestroy {

  @ViewChild('AttachmentList') AttachmentList?: AttachmentListComponent;

  constructor(
    private articleRepository: ArticleRepository,
    private attachmentRepository: AttachmentRepository,
    private attachmentLinkReplaceService: AttachmentLinkReplaceService,
    private messengerService: MessengerService) {
    effect(() => {
      const articleId = this.articleId();
      if (articleId !== 0) {
        untracked(() => this.load());
      }
    });
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Идентификатор статьи */
  articleId = input(0);

  /** Событие изменения пользователя */
  @Output() changed = new EventEmitter<number>();

  /** Событие закрытия */
  @Output() closed = new EventEmitter<void>();

  /** Модель */
  model = signal(new ArticleViewModel(), { equal: () => false });

  /** Ошибки */
  errors = signal<string[]>([]);

  /** В процессе загрузки */
  loading = signal(false);

  /** Функция отправки изображения через Editor */
  uploadFunc: UploadFunction = (file, progress: ProgressCallback) => {
    return new Observable<string>(sub => {
      this.attachmentRepository.add(null, file).subscribeWithDestroy({
        next: state => {
          if (state.state == 'finish') {
            const attachmentId = state.response!;
            const url = this.attachmentRepository.getUrl(attachmentId);
            if (this.AttachmentList) {
              const attachment = new Attachment();
              attachment.Id = attachmentId;
              attachment.ArticleId = 0;
              attachment.Name = file.name;
              attachment.Type = AttachmentType.System;
              this.AttachmentList.add(attachment);
            }
            sub.next(url);
            sub.complete();
          }

          if (state.state == 'in_progress') {
            progress(100, state.progress);
          }
        },
        error: e => sub.error(e)
      }, this.destroyer$);
    });
  }

  onSaveClick = () : void => {
    const model = this.model();

    this.loading.set(true);
    this.errors.set([]);
    const systemAttachments = this.AttachmentList?.attachments.items().filter(x => x.Type.Value == 'system' && x.ArticleId == 0).map(x => x.Id) ?? [];
    if (model.Id == 0) {
      this.articleRepository.add(model.convert(this.attachmentLinkReplaceService), systemAttachments).subscribeWithDestroy({
        next: (articleId) => {
          model.Id = articleId;
          this.loadFiles(articleId).subscribeWithDestroy({
            next: () => this.saveComplete(),
            error: (e) => { this.error(e) }
          }, this.destroyer$);
        },
        error: (error) => { this.error(error) }
      }, this.destroyer$);
    } else {

      this.articleRepository.update(model.convert(this.attachmentLinkReplaceService), systemAttachments).subscribeWithDestroy({
        next: () => {
          this.loadFiles(model.Id).subscribeWithDestroy({
            next: () => this.saveComplete(),
            error: (e) => { this.error(e) }
          }, this.destroyer$);
        },
        error: (error: ProblemDetailApsNet) => { this.error(error) }
      }, this.destroyer$);
    }
  };

  /** Загрузить вложения */
  private loadFiles = (articleId: number): Observable<void> => {
    return new Observable(sub => {
      if (this.AttachmentList) {
        this.AttachmentList.uploadAttachments(articleId).subscribeWithDestroy({
          next: () => {
            sub.next();
            sub.complete();
          },
          error: e => sub.error(e)
        }, this.destroyer$);
      } else {
        sub.next();
        sub.complete();
      }
    });
  }

  /** Обработчик команды закрытия окна */
  onCloseClick = () : void => {
    this.closed.emit();
  }

  /** Завершение изменения */
  private saveComplete() : void {
    const model = this.model();

    this.onCloseClick();
    this.changed.emit(model.Id);
    this.loading.set(false);
  }

  /** Обработчик ошибки */
  private error(error: ProblemDetailApsNet) : void {
    this.loading.set(false);
    if (error.is400StatusCode)
      this.errors.set(error.FullError);
    else
      this.messengerService.ShowException(error)
  }

  /** Загрузка */
  private load = () : void => {
    const articleId = this.articleId();
    if (articleId != 0) {
      this.loading.set(true);
      this.articleRepository.get(articleId).subscribeWithDestroy({
        next: (item) => {
          this.model.update(model => {
            model.update(item, this.attachmentLinkReplaceService);
            return model;
          });
          this.loading.set(false);
        },
        error: (e: ProblemDetailApsNet) => {
          this.error(e);
          this.loading.set(false);
        }
      }, this.destroyer$);
    }
  }
}
