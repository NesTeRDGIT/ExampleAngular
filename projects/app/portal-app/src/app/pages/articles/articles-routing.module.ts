import { NgModule } from '@angular/core';
import { ArticleManagerComponent } from './pages/article-manager/article-manager.component'
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { ArticleViewComponent } from './pages/article-view/article-view.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleManagerComponent,
  },
  {
    path: ':articleId',
    component: ArticleViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
})
export class ArticlesRoutingModule { }