export interface Category {
  _id: string;
  name: string;
  parent: string | null;
  order: number;
  children: Category[];
}