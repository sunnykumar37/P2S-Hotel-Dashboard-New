import express from 'express';
import Donation from '../models/Donation.js';

const router = express.Router();

// Get all donations with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.donationDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const donations = await Donation.find(query)
      .populate('ngoId', 'name email')
      .sort({ donationDate: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    const savedDonation = await donation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('ngoId', 'name email');
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    donation.status = status;
    const updatedDonation = await donation.save();
    res.json(updatedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update donation
router.put('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    Object.assign(donation, req.body);
    const updatedDonation = await donation.save();
    res.json(updatedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete donation
router.delete('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    await donation.remove();
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donation statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const acceptedDonations = await Donation.countDocuments({ status: 'accepted' });
    const distributedDonations = await Donation.countDocuments({ status: 'distributed' });
    
    const totalCarbonFootprint = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$carbonFootprint' }
        }
      }
    ]);

    res.json({
      total: totalDonations,
      pending: pendingDonations,
      accepted: acceptedDonations,
      distributed: distributedDonations,
      carbonFootprint: totalCarbonFootprint[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 