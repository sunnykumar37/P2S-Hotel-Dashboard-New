import express from 'express';
import NGO from '../models/NGO.js';

const router = express.Router();

// Get all NGOs with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'contactPerson.name': { $regex: search, $options: 'i' } }
      ];
    }

    const ngos = await NGO.find(query).sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new NGO
router.post('/', async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    const savedNGO = await ngo.save();
    res.status(201).json(savedNGO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get NGO by ID
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update NGO
router.put('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    Object.assign(ngo, req.body);
    const updatedNGO = await ngo.save();
    res.json(updatedNGO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete NGO
router.delete('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    await ngo.remove();
    res.json({ message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update NGO status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    ngo.status = status;
    const updatedNGO = await ngo.save();
    res.json(updatedNGO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get NGO statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalNGOs = await NGO.countDocuments();
    const activeNGOs = await NGO.countDocuments({ status: 'active' });
    const pendingNGOs = await NGO.countDocuments({ status: 'pending' });
    
    const beneficiariesServed = await NGO.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$beneficiariesCount' }
        }
      }
    ]);

    const serviceAreaStats = await NGO.aggregate([
      { $unwind: '$serviceAreas' },
      {
        $group: {
          _id: '$serviceAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      total: totalNGOs,
      active: activeNGOs,
      pending: pendingNGOs,
      beneficiariesServed: beneficiariesServed[0]?.total || 0,
      serviceAreaStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 