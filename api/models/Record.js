import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  // Unique ID from frontend (UUID)
  id: { type: String, required: true, unique: true },
  
  // Agent Details
  agentId: { type: String, required: true },
  agentName: { type: String, required: true },
  
  // Time Period
  month: { type: String, required: true },
  week: { type: String, required: true },
  
  // Metrics (Flexible to allow for CSV variations, or strict if needed)
  qualityScore: { type: Number },
  aht: { type: Number },
  sentimentScore: { type: Number },
  
  // Allow other fields from CSV dynamic import
  details: { type: Map, of: mongoose.Schema.Types.Mixed },

  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // strict: false allows for dynamic fields from CSVs

export default mongoose.models.Record || mongoose.model('Record', recordSchema);
