import { Schema, model, models } from 'mongoose';
import Product from './Product';


const ProductSchema = Product.schema;

const DrinkSchema = new Schema(
  {
    ...ProductSchema.obj,
    brand: {
      type: String,
    },
    hasAlcohol: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '700ml',
    },
  },
  {
    versionKey: false,
  }
);


const Drink = models.Drink || model('Drink', DrinkSchema);

export default Drink;
