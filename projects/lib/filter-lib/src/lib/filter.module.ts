import { NgModule } from '@angular/core';
import { SharedModule } from '@shared-lib';
import { ComponentsModule } from '@components-lib';

import { FilterPanelComponent } from './component/filter-panel/filter-panel.component';
import { FilterDateRangeComponent } from './component/filter-panel/filter-date-range/filter-date-range.component';
import { FilterTextComponent } from './component/filter-panel/filter-text/filter-text.component';
import { FilterDateComponent } from './component/filter-panel/filter-date/filter-date.component';
import { FilterSelectComponent } from './component/filter-panel/filter-select/filter-select.component';
import { FilterCheckBoxComponent } from './component/filter-panel/filter-check-box/filter-check-box.component';
import { FilterTreeComponent } from './component/filter-panel/filter-tree/filter-tree.component';
import { FilterMaskTextComponent } from './component/filter-panel/filter-mask-text/filter-mask-text.component';
import { FilterNumberComponent } from './component/filter-panel/filter-number/filter-number.component';

import { FilterService } from './service/filter.service';
import { UrlServerSideService } from './service/urlServices/urlServerSide.service';
import { TableLazyLoadService } from './service/tableLazyLoad.service';
import { UrlSortService } from './service/urlServices/services/urlSort.service';
import { UrlPaginationService } from './service/urlServices/services/urlPagination.service';
import { UrlFilterService } from './service/urlServices/services/urlFilter.service';
import { BrowserQueryStringService } from './service/browserQueryString.service';
import { UrlMetadataService } from './service/urlServices/services/urlMetadata.service';


@NgModule({
  imports: [SharedModule, ComponentsModule],
  exports: [
    FilterPanelComponent, FilterTextComponent, FilterDateComponent, FilterSelectComponent,
    FilterDateRangeComponent, FilterCheckBoxComponent, FilterTreeComponent, FilterNumberComponent, FilterMaskTextComponent],
  declarations: [FilterPanelComponent, FilterTextComponent, FilterDateComponent, FilterSelectComponent, FilterCheckBoxComponent,
    FilterDateRangeComponent, FilterTreeComponent, FilterNumberComponent, FilterMaskTextComponent],
  providers: [
    { provide: FilterService, useClass: FilterService },
    { provide: UrlFilterService, useClass: UrlFilterService },
    { provide: UrlSortService, useClass: UrlSortService },
    { provide: UrlPaginationService, useClass: UrlPaginationService },
    { provide: UrlServerSideService, useClass: UrlServerSideService },
    { provide: TableLazyLoadService, useClass: TableLazyLoadService},
    { provide: UrlMetadataService, useClass: UrlMetadataService },
    { provide: BrowserQueryStringService, useClass: BrowserQueryStringService}
  ],
})
export class FilterModule {
}
