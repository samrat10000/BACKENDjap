import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Sushi', 'Ramen', 'Takoyaki', 'Matcha', 'Bento', 'Sake', 'Tempura'],
    },
    description: {
      type: String,
      required: [true, 'Please add a restaurant description'],
      trim: true,
      maxlength: 800,
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add a contact email'],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Please add a business address'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
      set: (value) => value || undefined,
    },
    priceRange: {
      type: String,
      default: '$$',
      enum: ['$', '$$', '$$$', '$$$$'],
    },
    cuisines: {
      type: [String],
      default: [],
    },
    openingHours: {
      type: [String],
      default: [],
    },
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    pickupAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ owner: 1, createdAt: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
