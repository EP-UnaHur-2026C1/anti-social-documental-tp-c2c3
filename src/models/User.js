import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    unique: true
  },
  // Array de IDs de otros Usuarios que te siguen
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  // Array de IDs de otros Usuarios a los que sigues
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false 
});

export default mongoose.model('User', userSchema);