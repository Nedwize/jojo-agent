import mongoose, { Document, Schema } from 'mongoose';

// EpisodicMemory interface
export interface SemanticMemory {
    userId: string;
  memory: string;
}

// Mongoose document interface
export interface SemanticMemoryDocument extends Document {
  userId: string;
  memory: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the EpisodicMemory schema
const semanticMemorySchema = new Schema<SemanticMemoryDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    memory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disable __v field
  },
);

// Add composite indexes for better query performance
semanticMemorySchema.index({ userId: 1 });
semanticMemorySchema.index({ memory: 1 });

// Instance methods
semanticMemorySchema.methods.toJSON = function () {
  const memoryObject = this.toObject();
  delete memoryObject._id;
  delete memoryObject.__v;
  return memoryObject;
};


// Create and export the EpisodicMemory model
export const SemanticMemoryModel = mongoose.model<SemanticMemoryDocument>('SemanticMemory', semanticMemorySchema);

export default SemanticMemoryModel; 