export interface TreeNode {
  _id: string;
  name: string;
  parent: string | null;
  order: number;
  children?: TreeNode[];
  isDeleted?: boolean;
  [key: string]: any; 
}