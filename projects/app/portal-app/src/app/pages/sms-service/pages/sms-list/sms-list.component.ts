import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ComponentVisible, MessengerService, PrimeNgTableSelection } from '@shared-lib';
import { AuthService, SmsServiceProfile } from '@authorization-lib';
import { FilterEvent, FilterPanelComponent, FilterField, FilterServerSideCollection, PrimeLazyLoadService, PaginationData, SortFieldData } from '@filter-lib';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { MessageListItemRepository } from '@SmsServiceModuleRoot/services/repository/messageListItem.repository';
import { MessageListItem } from '@SmsServiceModuleRoot/model/MessageListItem';
import { DictionaryService } from '@SmsServiceModuleRoot/services/dictionary.service';
import { MessageSummaryComponent } from '../common/message-summary/message-summary.component';

@Component({
  selector: 'zms-sms-list',
  templateUrl: './sms-list.component.html',
  styleUrls: ['./sms-list.component.scss']
})
export class SmsListComponent implements OnInit, AfterViewInit {

  @ViewChild("FilterPanel") FilterPanel: FilterPanelComponent | undefined;
  @ViewChild("Table") Table: Table | undefined;
  @ViewChild("ZmsMessageSummary") ZmsMessageSummary: MessageSummaryComponent | undefined;

  constructor(
    private messageListItemRepository: MessageListItemRepository,
    private messengerService: MessengerService,
    private authService: AuthService,
    private primeLazyLoadService: PrimeLazyLoadService,
    public dictionaryService: DictionaryService
  ) {

  }

  private afterInit = false;
  ngAfterViewInit(): void {
    this.afterInit = true;
    this.smsItems.readFromUrl();
    this.primeLazyLoadService.applyFieldInfoFields(this.FilterPanel, this.Table, this.smsItems);
  }


  ngOnInit(): void {
    this.getUserProfile();
    this.authService.loginChanged.subscribe({
      next: () => {
        this.getUserProfile();
      }
    });
  }

  private getUserProfile = () => {
    this.authService.getProfiles().subscribe({
      next: (profiles) => {
        this.userProfile = profiles.SmsService
      }
    });
  }

  /** Элементы списка */
  smsItems: FilterServerSideCollection<MessageListItem> = new FilterServerSideCollection<MessageListItem>([]);

  /** Профиль пользователя */
  private userProfile = new SmsServiceProfile([]);

  /** В процессе загрузки */
  loading = false;

  /** Выбранные элементы */
  selection = new PrimeNgTableSelection<MessageListItem>();

  /** Обработка события фильтрации */
  onFilter = (e: FilterEvent) => {
    this.load(e.fields, this.primeLazyLoadService.toFirstPaginationTable(this.Table), this.primeLazyLoadService.createSortFieldsFromTable(this.Table));
    this.ZmsMessageSummary?.clearFilter();
  }

  /** Обработка события фильтрации Summary */
  onFilterSummary = (inputFilter: FilterField[]) => {
    const filter = this.smsItems.filter.filter(x => !x.custom);
    filter.push(...inputFilter);
    this.load(filter, this.primeLazyLoadService.toFirstPaginationTable(this.Table), this.primeLazyLoadService.createSortFieldsFromTable(this.Table));
  }

  /** Отображение детальной информации */
  detailVisible = new ComponentVisible(0, false);

  /** Показать детали сообщения */
  onShowDetail = (id: number) => {
    this.detailVisible.value = id;
    this.detailVisible.visible = true;
  }

  /** Скрыть детали сообщения */
  onHideDetail = () => {
    this.detailVisible.visible = false;
  }


  private load = (filter: FilterField[], pagination: PaginationData, sort: SortFieldData[], fixUrl = true) => {
    try {
      this.loading = true;
      this.ZmsMessageSummary?.load(filter);
      this.messageListItemRepository.get(filter, pagination, sort).subscribe({
        next: (result) => {
          this.smsItems.updateItems(result.Data, filter, result.Metadata.Pagination.Count, pagination, sort);
          if (fixUrl) {
            this.smsItems.writeToUrl();
          }
          this.loading = false;
        },
        error: (error) => { this.messengerService.ShowException(error); this.loading = false; }
      });
    } catch (e) {
      this.messengerService.ShowException(e);
      this.loading = false;
    }
  }

  loadLazyTable = (e: TableLazyLoadEvent) => {
    if (this.afterInit) {
      this.load(this.smsItems.filter,
        this.primeLazyLoadService.createPaginationData(e),
        this.primeLazyLoadService.createSortFields(e)
      );
    }
  }
}
