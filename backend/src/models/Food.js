import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['grains', 'vegetables', 'fruits', 'dairy', 'protein', 'other']
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'low', 'expired'],
    default: 'available'
  },
  notes: String,
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }
}, {
  timestamps: true
});

// Add index for better query performance
foodSchema.index({ name: 1, status: 1 });

export default mongoose.model('Food', foodSchema); 