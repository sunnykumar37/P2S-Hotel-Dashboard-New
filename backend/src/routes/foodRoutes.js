import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// Get all food items with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foodItems = await Food.find(query).sort({ expiryDate: 1 });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new food item
router.post('/', async (req, res) => {
  try {
    const foodItem = new Food(req.body);
    const savedFoodItem = await foodItem.save();
    res.status(201).json(savedFoodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get food item by ID
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await Food.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update food item
router.put('/:id', async (req, res) => {
  try {
    const foodItem = await Food.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    Object.assign(foodItem, req.body);
    const updatedFoodItem = await foodItem.save();
    res.json(updatedFoodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete food item
router.delete('/:id', async (req, res) => {
  try {
    const foodItem = await Food.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    await foodItem.remove();
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food inventory statistics
router.get('/stats/inventory', async (req, res) => {
  try {
    const totalItems = await Food.countDocuments();
    const lowStockItems = await Food.countDocuments({ status: 'low' });
    const expiredItems = await Food.countDocuments({ status: 'expired' });
    
    const categoryStats = await Food.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    res.json({
      total: totalItems,
      lowStock: lowStockItems,
      expired: expiredItems,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update food item status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const foodItem = await Food.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    foodItem.status = status;
    const updatedFoodItem = await foodItem.save();
    res.json(updatedFoodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 