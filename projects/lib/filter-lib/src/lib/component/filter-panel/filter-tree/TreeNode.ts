
/** Узел дерева */
export interface TreeNode {
  /** Надпись */
  label: string,

  /** Данные */
  data: unknown,

  /** Дочернии записи */
  children: TreeNode[]
}