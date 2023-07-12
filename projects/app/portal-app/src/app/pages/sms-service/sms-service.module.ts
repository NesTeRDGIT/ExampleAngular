import { SmsServiceRoutingModule } from "./sms-service-routing.module"
import { NgModule } from '@angular/core';

import { SharedModule } from "@shared-lib";


import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoFocusModule } from 'primeng/autofocus';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';



import { FilterModule } from "@filter-lib";

import { SmsListComponent } from "./pages/sms-list/sms-list.component"
import { MessageViewerComponent } from './pages/common/message-viewer/message-viewer.component'
import { MessageSummaryComponent } from './pages/common/message-summary/message-summary.component'

import { MessageListItemRepository } from './services/repository/messageListItem.repository'
import { DictionaryRepository } from './services/repository/dictionary.repository';
import { DictionaryService } from './services/dictionary.service';
import { MessageRepository } from './services/repository/message.repository'
import { MessageSummaryRepository } from './services/repository/messageSummary.repository'

@NgModule({
  declarations: [SmsListComponent, MessageViewerComponent, MessageSummaryComponent],
  providers: [
    { provide: MessageListItemRepository, useClass: MessageListItemRepository },
    { provide: MessageRepository, useClass: MessageRepository },
    { provide: DictionaryRepository, useClass: DictionaryRepository },
    { provide: DictionaryService, useClass: DictionaryService },
    { provide: MessageSummaryRepository, useClass: MessageSummaryRepository }
  ],
  imports: [SmsServiceRoutingModule, SharedModule,
    TableModule, DialogModule, ContextMenuModule, CheckboxModule,
    InputMaskModule, DropdownModule, DividerModule, TabViewModule, InputNumberModule, ToggleButtonModule,
    StepsModule, CardModule, InputTextareaModule, AutoFocusModule, ToolbarModule, TagModule, FilterModule]
})
export class SmsServiceModule { }
