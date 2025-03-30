import mongoose from 'mongoose';
import validator from 'validator';

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contactPerson: {
    name: String,
    position: String,
    phone: String,
    email: String
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  serviceAreas: [{
    type: String
  }],
  beneficiariesCount: {
    type: Number,
    default: 0
  },
  verificationDocuments: [{
    type: String
  }],
  notes: String
}, {
  timestamps: true
});

// Add indexes for better query performance
ngoSchema.index({ email: 1, registrationNumber: 1 });
ngoSchema.index({ status: 1 });

export default mongoose.model('NGO', ngoSchema); 