
import { ChangeDetectionStrategy, Component, input, model, ViewChild } from '@angular/core';
import { DictionaryService } from '@EmployeeModuleRoot/service/dictionary.service';
import { WorkplaceTreeNode } from '@EmployeeModuleRoot/model/dictionary/WorkplaceTreeNode';
import { OverlayPanelComponent, TextInputComponent } from '@components-lib';

@Component({
  selector: 'zms-workplace-select',
  templateUrl: './workplace-select.component.html',
  styleUrls: ['./workplace-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplaceSelectComponent {
  @ViewChild('overlayPanel') overlayPanel?: OverlayPanelComponent;
  @ViewChild('addressInput') addressInput?: TextInputComponent;

  constructor(public dictionaryService: DictionaryService) {
  }

  /** Режим только для чтения */
  readonly = input(false);

  /** Текст */
  text = model("");

  /** Идентификатор местоположения */
  workplaceValue = model(0);

  /** Событие отмены */
  onCancel = () : void => {
    this.hideEditPanel();
  }

  /** Событие выбора адреса */
  onAccept = (select: WorkplaceTreeNode | null) : void => {
    this.hideEditPanel();
    if (select !== null) {
      this.text.set(select.Item.FullName);
      this.workplaceValue.set(select.Item.Value);
    } else {
      this.text.set("");
      this.workplaceValue.set(0);
    }
  }

  onEditClick = () : void => {
    if (this.isShowEditPanel) {
      this.hideEditPanel();
    } else {
      this.showEditPanel();
    }
  }

  private isShowEditPanel = false;
  private showEditPanel = () : void => {
    if (this.overlayPanel && this.addressInput && this.addressInput.el) {
      this.overlayPanel.showPanel(this.addressInput.el.nativeElement);
      this.isShowEditPanel = true;
    }
  }

  private hideEditPanel = () : void => {
    if (this.overlayPanel && this.addressInput) {
      this.overlayPanel.hidePanel();
      this.isShowEditPanel = false;
    }
  }
}
