export interface Ingredient {
  _id: string;
  name: string;
  price: number;
  unit: "kg" | "g" | "l" | "ml" | "u" | "pack";
  parent: string | null;        
  order: number;                
  isDeleted: boolean;
  children: Ingredient[];
}