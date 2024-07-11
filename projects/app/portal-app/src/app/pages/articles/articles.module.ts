import { ArticlesRoutingModule } from "./articles-routing.module"
import { NgModule } from '@angular/core';
import { SharedModule } from "@shared-lib";
import { FilterModule } from "@filter-lib";
import { ComponentsModule } from '@components-lib';
import { DownloadModule } from '@download-lib';

import { ArticleManagerComponent } from './pages/article-manager/article-manager.component';
import { ArticleEditComponent } from './pages/article-manager/article-edit/article-edit.component';
import { AttachmentListComponent } from './pages/common/attachment-list/attachment-list.component';
import { ArticleViewComponent } from './pages/article-view/article-view.component';
import { ArticleItemComponent } from './pages/article-manager/article-item/article-item.component';

import { ArticleListItemRepository } from './services/repository/articleListItem.repository';
import { AttachmentRepository } from './services/repository/attachment.repository';
import { ArticleRepository } from './services/repository/article.repository';

import { AttachmentLinkReplaceService } from './services/attachmentLinkReplace.service';

@NgModule({
  imports: [ArticlesRoutingModule, SharedModule, FilterModule, ComponentsModule, DownloadModule],
  declarations: [ArticleManagerComponent, ArticleEditComponent, AttachmentListComponent, ArticleViewComponent,
    ArticleItemComponent],
  providers: [
    { provide: ArticleListItemRepository, useClass: ArticleListItemRepository },
    { provide: AttachmentRepository, useClass: AttachmentRepository },
    { provide: ArticleRepository, useClass: ArticleRepository },
    { provide: AttachmentLinkReplaceService, useClass: AttachmentLinkReplaceService }
  ]
})
export class ArticlesModule { }
