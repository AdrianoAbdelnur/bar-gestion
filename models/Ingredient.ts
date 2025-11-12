import { Schema, model, models } from 'mongoose';

const IngredientSchema = new Schema(
  {
    name: { 
            type: String 
        },
    price: { 
            type: Number 
        },
    category: [
        { 
            type: String 
        }
    ],
    isDeleted: { 
        type: Boolean, default: false 
    },
  },
  { versionKey: false }
);

const Ingredient = models.Ingredient || model('Ingredient', IngredientSchema);

export default Ingredient;
