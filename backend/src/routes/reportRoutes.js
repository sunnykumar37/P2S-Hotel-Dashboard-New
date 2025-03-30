import express from 'express';
import Donation from '../models/Donation.js';
import Food from '../models/Food.js';
import NGO from '../models/NGO.js';

const router = express.Router();

// Get dashboard overview statistics
router.get('/dashboard/overview', async (req, res) => {
  try {
    const totalMealsDonated = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $reduce: {
                input: '$foodItems',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.quantity'] }
              }
            }
          }
        }
      }
    ]);

    const activeNGOPartners = await NGO.countDocuments({ status: 'active' });
    
    const carbonFootprint = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$carbonFootprint' }
        }
      }
    ]);

    const successRate = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          distributed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'distributed'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          rate: {
            $multiply: [
              { $divide: ['$distributed', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      totalMealsDonated: totalMealsDonated[0]?.total || 0,
      activeNGOPartners,
      carbonFootprintReduced: carbonFootprint[0]?.total || 0,
      successRate: successRate[0]?.rate || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly donation trends
router.get('/trends/monthly', async (req, res) => {
  try {
    const monthlyTrends = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' }
          },
          donations: { $sum: 1 },
          totalQuantity: {
            $sum: {
              $reduce: {
                input: '$foodItems',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.quantity'] }
              }
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(monthlyTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food distribution by category
router.get('/distribution/food-category', async (req, res) => {
  try {
    const distribution = await Food.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get NGO performance metrics
router.get('/ngo/performance', async (req, res) => {
  try {
    const ngoPerformance = await Donation.aggregate([
      {
        $lookup: {
          from: 'ngos',
          localField: 'ngoId',
          foreignField: '_id',
          as: 'ngo'
        }
      },
      { $unwind: '$ngo' },
      {
        $group: {
          _id: '$ngoId',
          ngoName: { $first: '$ngo.name' },
          totalDonations: { $sum: 1 },
          totalQuantity: {
            $sum: {
              $reduce: {
                input: '$foodItems',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.quantity'] }
              }
            }
          },
          successfulDeliveries: {
            $sum: {
              $cond: [{ $eq: ['$status', 'distributed'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          ngoName: 1,
          totalDonations: 1,
          totalQuantity: 1,
          successRate: {
            $multiply: [
              {
                $divide: ['$successfulDeliveries', '$totalDonations']
              },
              100
            ]
          }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    res.json(ngoPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expiry alerts for food items
router.get('/alerts/expiry', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiryAlerts = await Food.find({
      expiryDate: {
        $gte: today,
        $lte: nextWeek
      }
    }).sort({ expiryDate: 1 });

    res.json(expiryAlerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate custom date range report
router.post('/custom', async (req, res) => {
  try {
    const { startDate, endDate, metrics } = req.body;
    const report = {};

    if (metrics.includes('donations')) {
      report.donations = await Donation.find({
        donationDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).populate('ngoId', 'name');
    }

    if (metrics.includes('food')) {
      report.foodItems = await Food.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });
    }

    if (metrics.includes('ngos')) {
      report.ngos = await NGO.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 