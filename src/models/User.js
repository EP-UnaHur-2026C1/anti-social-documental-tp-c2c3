import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 50
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false 
});

export default mongoose.model('User', userSchema);