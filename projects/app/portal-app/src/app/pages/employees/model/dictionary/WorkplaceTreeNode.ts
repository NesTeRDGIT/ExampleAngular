import { Workplace } from './Workplace';
import { CheckPropertyService } from "@shared-lib";
import { ArgumentNullException } from "@shared-lib";

/** Иерархия рабочего места */
export class WorkplaceTreeNode {

  /** Рабочее место */
  Item = new Workplace();

  /** Дочерние рабочие места */
  Children: WorkplaceTreeNode[] = [];


  static Create(source: any): WorkplaceTreeNode {
    if (source === null || source === undefined) {
      throw new ArgumentNullException("source");
    }
    const dest = new WorkplaceTreeNode();

    const errField = CheckPropertyService.CheckProperty(dest, source);
    if (errField.length !== 0) {
      throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
    }
    dest.Item = Workplace.Create(source.Item);
    dest.Children = source.Children.map((x: any) => WorkplaceTreeNode.Create(x));
    return dest;
  }
}
