import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const JobSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  prompt: String,
  params: Object,
  status: { type: String, default: 'queued' },
  resultUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
export default mongoose.model('Job', JobSchema);
