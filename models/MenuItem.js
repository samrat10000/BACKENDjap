import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'very-hot'],
    },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a menu item name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: 1200,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&q=80',
      set: (value) => value || undefined,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    preparationTimeMinutes: {
      type: Number,
      min: 0,
      default: 15,
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    nutrition: {
      type: nutritionSchema,
      default: {},
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ restaurant: 1, category: 1, sortOrder: 1, createdAt: -1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
