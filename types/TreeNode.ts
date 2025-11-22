export interface TreeNodeBase<T extends TreeNodeBase<T> = any> {
  _id: string;
  name: string;
  parent: string | null;
  order: number;
  children?: T[];

  price?: number | null;
  unit?: string | null;
}