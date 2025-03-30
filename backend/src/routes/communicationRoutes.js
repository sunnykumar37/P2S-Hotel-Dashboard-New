import express from 'express';
import Communication from '../models/Communication.js';

const router = express.Router();

// Get all communications with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, status, priority, search } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { sender: { $regex: search, $options: 'i' } },
        { recipient: { $regex: search, $options: 'i' } }
      ];
    }

    const communications = await Communication.find(query)
      .sort({ createdAt: -1 });
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new communication
router.post('/', async (req, res) => {
  try {
    const communication = new Communication(req.body);
    const savedCommunication = await communication.save();
    res.status(201).json(savedCommunication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get communication by ID
router.get('/:id', async (req, res) => {
  try {
    const communication = await Communication.findById(req.params.id);
    
    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }
    
    res.json(communication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update communication status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const communication = await Communication.findById(req.params.id);
    
    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }
    
    communication.status = status;
    const updatedCommunication = await communication.save();
    res.json(updatedCommunication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete communication
router.delete('/:id', async (req, res) => {
  try {
    const communication = await Communication.findById(req.params.id);
    
    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }
    
    await communication.remove();
    res.json({ message: 'Communication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get communication statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalMessages = await Communication.countDocuments();
    const unreadMessages = await Communication.countDocuments({ status: 'sent' });
    const highPriorityMessages = await Communication.countDocuments({ priority: 'high' });
    
    const typeStats = await Communication.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = await Communication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total: totalMessages,
      unread: unreadMessages,
      highPriority: highPriorityMessages,
      typeStats,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update communication status
router.post('/bulk/status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    const result = await Communication.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    res.json({
      message: `Updated ${result.modifiedCount} communications`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 