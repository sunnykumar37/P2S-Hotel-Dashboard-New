import mongoose from 'mongoose';

const communicationSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'notification', 'message'],
    default: 'notification'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  attachments: [{
    filename: String,
    path: String,
    type: String
  }],
  metadata: {
    ip: String,
    userAgent: String,
    location: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
communicationSchema.index({ sender: 1, recipient: 1 });
communicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Communication', communicationSchema); 