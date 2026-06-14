import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user_nickName: {
    type: String,
    required: true,
    ref: 'User'
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

commentSchema.virtual('visible').get(function() {
  if (!this.createdAt) return true;
  const maxMonths = parseInt(process.env.COMMENT_MAX_AGE_MONTHS) || 6;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - maxMonths);
  return this.createdAt >= cutoffDate;
});

export default mongoose.model('Comment', commentSchema);