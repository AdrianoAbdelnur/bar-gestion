import { Schema, model, models } from 'mongoose';
import Product from './Product';

const ProductSchema = Product.schema;

const DishSchema = new Schema(
  {
    ...ProductSchema.obj,
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
    ],
    isVegan: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Dish = models.Dish || model('Dish', DishSchema);

export default Dish;
