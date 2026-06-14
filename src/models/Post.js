import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  user_nickName: {
    type: String,
    required: true,
    ref: 'User' // Referencia al modelo de Usuario
  },
  images: [{
    type: String // Array simple de strings para las URLs
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag' // Array de referencias a la colección Tags
  }]
}, { 
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false 
});

export default mongoose.model('Post', postSchema);