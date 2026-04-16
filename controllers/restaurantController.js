import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

const buildRestaurantPayload = (body, user) => ({
  name: body.name,
  location: body.location,
  category: body.category,
  description: body.description,
  phone: body.phone,
  email: body.email,
  address: body.address,
  image: body.image,
  coverImage: body.coverImage,
  priceRange: body.priceRange,
  cuisines: parseList(body.cuisines),
  openingHours: parseList(body.openingHours),
  deliveryAvailable: body.deliveryAvailable,
  pickupAvailable: body.pickupAvailable,
  isActive: body.isActive,
  owner: user._id,
});

const buildMenuItemPayload = (body, restaurantId) => ({
  name: body.name,
  price: body.price,
  description: body.description,
  category: body.category,
  image: body.image,
  preparationTimeMinutes: body.preparationTimeMinutes,
  dietaryTags: parseList(body.dietaryTags),
  ingredients: parseList(body.ingredients),
  nutrition: body.nutrition,
  sortOrder: body.sortOrder,
  isAvailable: body.isAvailable,
  restaurant: restaurantId,
});

const getOwnedRestaurant = async (restaurantId, userId) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return { status: 404, message: 'Restaurant not found' };
  }

  if (restaurant.owner.toString() !== userId.toString()) {
    return { status: 403, message: 'Not authorized to manage this restaurant' };
  }

  return { restaurant };
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant details
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const menuItems = await MenuItem.find({ restaurant: req.params.id }).sort({
      category: 1,
      sortOrder: 1,
      createdAt: -1,
    });

    if (restaurant) {
      res.json({ ...restaurant._doc, menuItems });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private/Vendor
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(buildRestaurantPayload(req.body, req.user));

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor's own restaurants
// @route   GET /api/restaurants/myrestaurants
// @access  Private/Vendor
export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vendor restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Vendor
export const updateRestaurant = async (req, res) => {
  try {
    const owned = await getOwnedRestaurant(req.params.id, req.user._id);

    if (!owned.restaurant) {
      return res.status(owned.status).json({ message: owned.message });
    }

    Object.assign(owned.restaurant, buildRestaurantPayload(req.body, req.user));
    owned.restaurant.owner = req.user._id;

    const updatedRestaurant = await owned.restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item to restaurant
// @route   POST /api/restaurants/:id/menu
// @access  Private/Vendor
export const addMenuItem = async (req, res) => {
  try {
    const owned = await getOwnedRestaurant(req.params.id, req.user._id);

    if (!owned.restaurant) {
      return res.status(owned.status).json({ message: owned.message });
    }

    const menuItem = await MenuItem.create(buildMenuItemPayload(req.body, req.params.id));

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/restaurants/:id/menu/:menuItemId
// @access  Private/Vendor
export const updateMenuItem = async (req, res) => {
  try {
    const owned = await getOwnedRestaurant(req.params.id, req.user._id);

    if (!owned.restaurant) {
      return res.status(owned.status).json({ message: owned.message });
    }

    const menuItem = await MenuItem.findOne({
      _id: req.params.menuItemId,
      restaurant: req.params.id,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    Object.assign(menuItem, buildMenuItemPayload(req.body, req.params.id));

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/restaurants/:id/menu/:menuItemId
// @access  Private/Vendor
export const deleteMenuItem = async (req, res) => {
  try {
    const owned = await getOwnedRestaurant(req.params.id, req.user._id);

    if (!owned.restaurant) {
      return res.status(owned.status).json({ message: owned.message });
    }

    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.menuItemId,
      restaurant: req.params.id,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item removed', id: req.params.menuItemId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
