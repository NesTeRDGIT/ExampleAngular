import { AfterViewInit, Component, ViewChild, OnDestroy, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { MessengerService, ObservableDestroyer, ComponentVisible } from '@shared-lib';
import { FilterEvent, TreeNode, FilterPanelComponent, FilterField, TableLazyLoadService, BrowserQueryStringService, FilterServerSideCollection } from '@filter-lib';
import { EmployeePhoto } from '@EmployeeModuleRoot/model/EmployeePhoto';
import { EmployeePhotoRepository } from '@EmployeeModuleRoot/service/repository/employeePhoto.repository';
import { ShowFullPhotoEvent } from './employee-card/ShowFullPhotoEvent';
import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';
import { EmployeeCardItemRepository } from '@EmployeeModuleRoot/service/repository/employeeCardItem.repository';
import { EmployeeCardItem } from '@EmployeeModuleRoot/model/EmployeeCardItem';
import { EmployeeSummaryComponent } from './employee-summary/employee-summary.component';
import { TableSelection } from '@components-lib';

@Component({
  selector: 'zms-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeViewComponent implements AfterViewInit, OnDestroy {

  @ViewChild("FilterPanel") FilterPanel?: FilterPanelComponent;
  @ViewChild("ZmsEmployeeSummary") ZmsEmployeeSummary?: EmployeeSummaryComponent;

  constructor(
    private employeeViewListItemRepository: EmployeeCardItemRepository,
    public employeePhotoRepository: EmployeePhotoRepository,
    private messengerService: MessengerService,
    public dictionaryService: DictionaryService,
    private tableLazyLoadService: TableLazyLoadService,
    private BrowserQueryStringService: BrowserQueryStringService) {
  }

  ngAfterViewInit(): void {
    this.tableLazyLoadService.applyQueryParameters(this.FilterPanel, null);
  }

  private destroyer$ = new ObservableDestroyer();
  ngOnDestroy(): void {
    this.destroyer$.destroy();
  }

  /** Показать сотрудника */
  showEmployeeId = input<number>(0);

  /** Ошибки */
  errors = signal<string[]>([]);

  /** Просмотр в полноэкранном режиме */
  fullScreenPhotoVisible = new ComponentVisible<EmployeePhoto[]>([]);

  /** Индекс изображения в полноэкранном режиме */
  fullScreenPhotoIndex = signal(0);

  /** В процессе загрузки */
  loading = signal(false);

  /** Сотрудники */
  employees = new FilterServerSideCollection<EmployeeCardItem>([]);

  /** Выбранные элементы */
  selection = new TableSelection<EmployeeCardItem>();

  onZmsEmployeeCardClick = (item: EmployeeCardItem) : void => {
    this.selection.selectedItems.set([item]);
  }
  private workplaceItems: WorkplaceTreeNode[] = [];
  private treeNodeWorkplace: TreeNode[] = [];

  /** Получить древо из списка */
  getNodesFromCollection = (items: WorkplaceTreeNode[]): TreeNode[] => {
    if (this.workplaceItems !== items) {
      this.workplaceItems = items;
      this.treeNodeWorkplace = this.getNodes(items);
    }
    return this.treeNodeWorkplace;
  }

  /** Создать узел */
  private getNodes = (items: WorkplaceTreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    items.forEach(x => {
      result.push({
        label: x.Item.Name,
        data: x.Item.Value,
        children: this.getNodes(x.Children)
      })
    });
    return result;
  }


  /** Показать фото */
  onShowFullPhoto = (event: ShowFullPhotoEvent) : void => {
    this.fullScreenPhotoVisible.show(event.photos);
    this.fullScreenPhotoIndex.set(event.selectIndex);
  }

  onFilter = (e: FilterEvent) : void => {
    this.load(e.fields);
    this.ZmsEmployeeSummary?.clearFilter();
  }

  /** Обработка события фильтрации Summary */
  onFilterSummary = (inputFilter: FilterField[]) : void => {
    const filter = this.employees.filter().filter(x => !x.custom);
    filter.push(...inputFilter);
    this.load(filter);
  }

  /** Загрузка */
  private load = (filter: FilterField[]) : void => {
    this.loading.set(true);
    this.employeeViewListItemRepository.get(filter).subscribeWithDestroy({
      next: (data) => {
        this.employees.update(data, filter);
        this.BrowserQueryStringService.writeToUrl(this.employees);
        this.ZmsEmployeeSummary?.update(data);
        this.loading.set(false);
        this.selectDefault();
      },
      error: (error) => { 
        this.messengerService.ShowException(error);
        this.loading.set(false); 
      }
    }, this.destroyer$);
  }

  /** Открыть МО по умолчанию */
  private selectDefault = () : void => {
    const showEmployeeId = this.showEmployeeId();
    if (showEmployeeId !== 0) {
      const findItem = this.employees.items().find(x => x.Id == this.showEmployeeId());
      if (findItem) {
        this.selection.selectedItems.set([findItem]);
      }
      setTimeout(() => {
        this.scrollToViewSelect();
      }, 0);
    }
  }

  private scrollToViewSelect = () : void => {
    const selectedItems = this.selection.selectedItems();
    if(selectedItems.length !== 0){
      const selected = selectedItems[0];
      const selectedHtml = document.querySelector(`[data-employeeId='${selected.Id}']`);
      selectedHtml?.scrollIntoView();
    }
  }
}
