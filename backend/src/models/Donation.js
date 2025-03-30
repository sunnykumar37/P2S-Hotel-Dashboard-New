import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  foodItems: [{
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  donationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'distributed'],
    default: 'pending'
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  notes: String,
  carbonFootprint: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Donation', donationSchema); 