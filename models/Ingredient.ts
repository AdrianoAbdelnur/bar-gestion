import { Schema, model, models } from 'mongoose';

const IngredientSchema = new Schema(
  {
    name: { 
      type: String,
      required: true
    },
    price: { 
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ["Kg", "g", "l", "ml", "u", "pack", null, ""],
      default: "",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      default: null,
    },
    order: {
      type: Number,
      default: 0
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ingredient = models.Ingredient || model('Ingredient', IngredientSchema);

export default Ingredient;