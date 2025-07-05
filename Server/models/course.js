import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);
