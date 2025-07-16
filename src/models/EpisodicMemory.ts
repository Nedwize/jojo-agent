import mongoose, { Document, Schema } from 'mongoose';

// EpisodicMemory interface
export interface EpisodicMemory {
  eventType: 'user_message' | 'inferred_result';
  summary: string;
  details: string;
  timestamp: Date;
  actor: 'assistant' | 'user';
}

// Mongoose document interface
export interface EpisodicMemoryDocument extends Document {
  eventType: 'user_message' | 'inferred_result';
  summary: string;
  details: string;
  timestamp: Date;
  actor: 'assistant' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Define the EpisodicMemory schema
const episodicMemorySchema = new Schema<EpisodicMemoryDocument>(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['user_message', 'inferred_result'],
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    actor: {
      type: String,
      required: true,
      enum: ['assistant', 'user'],
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disable __v field
  },
);

// Add composite indexes for better query performance
episodicMemorySchema.index({ actor: 1, timestamp: -1 });
episodicMemorySchema.index({ eventType: 1, timestamp: -1 });
episodicMemorySchema.index({ timestamp: -1 }); // For chronological queries

// Instance methods
episodicMemorySchema.methods.toJSON = function () {
  const memoryObject = this.toObject();
  delete memoryObject._id;
  delete memoryObject.__v;
  return memoryObject;
};

// Static methods
episodicMemorySchema.statics.findByEventType = function (eventType: string) {
  return this.find({ eventType }).sort({ timestamp: -1 });
};

episodicMemorySchema.statics.findByActor = function (actor: string) {
  return this.find({ actor }).sort({ timestamp: -1 });
};

episodicMemorySchema.statics.findRecent = function (limit: number = 10) {
  return this.find().sort({ timestamp: -1 }).limit(limit);
};

episodicMemorySchema.statics.findByDateRange = function (startDate: Date, endDate: Date) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ timestamp: -1 });
};

// Create and export the EpisodicMemory model
export const EpisodicMemoryModel = mongoose.model<EpisodicMemoryDocument>('EpisodicMemory', episodicMemorySchema);

export default EpisodicMemoryModel; 