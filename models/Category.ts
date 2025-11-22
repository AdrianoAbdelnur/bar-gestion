import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,    
      trim: true,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    order: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = models.Category || model('Category', CategorySchema);
export default Category;