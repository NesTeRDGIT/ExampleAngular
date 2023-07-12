import { Injector, NgModule } from '@angular/core';
import { SharedModule } from '@shared-lib';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { TooltipModule } from 'primeng/tooltip';

import { FilterPanelComponent } from './component/filter-panel/filter-panel.component';
import { FilterDateRangeComponent } from './component/filter-panel/filter-date-range/filter-date-range.component';
import { FilterTextComponent } from './component/filter-panel/filter-text/filter-text.component';
import { FilterDateComponent } from './component/filter-panel/filter-date/filter-date.component';
import { FilterSelectComponent } from './component/filter-panel/filter-select/filter-select.component';
import { FilterCheckBoxComponent } from './component/filter-panel/filter-check-box/filter-check-box.component';
import { FilterTreeComponent } from './component/filter-panel/filter-tree/filter-tree.component'
import { FilterNumberComponent } from './component/filter-panel/filter-number/filter-number.component';

import { FilterService } from './service/filter.service';
import { UrlServerSideService } from './service/urlServerSide.service';
import { PrimeLazyLoadService } from './prime-ng/primeLazyLoad.service';
import { UrlSortService } from './service/urlSort.service';
import { UrlPaginationService } from './service/urlPagination.service';
import { UrlFilterService } from './service/urlFilter.service';


@NgModule({
  imports: [SharedModule,
    ScrollPanelModule, TriStateCheckboxModule, TreeSelectModule, TooltipModule],
  exports: [
    FilterPanelComponent, FilterTextComponent, FilterDateComponent, FilterSelectComponent,
    FilterDateRangeComponent, FilterCheckBoxComponent, FilterTreeComponent, FilterNumberComponent],
  declarations: [FilterPanelComponent, FilterTextComponent, FilterDateComponent, FilterSelectComponent, FilterCheckBoxComponent,
    FilterDateRangeComponent, FilterTreeComponent, FilterNumberComponent],
  providers: [
    { provide: FilterService, useClass: FilterService },
    { provide: UrlFilterService, useClass: UrlFilterService },
    { provide: UrlSortService, useClass: UrlSortService },
    { provide: UrlPaginationService, useClass: UrlPaginationService },
    { provide: UrlServerSideService, useClass: UrlServerSideService },
    { provide: PrimeLazyLoadService, useClass: PrimeLazyLoadService}
  ],
})
export class FilterModule {

  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}

export let AppInjector: Injector;
