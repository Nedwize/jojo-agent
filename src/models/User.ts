import mongoose, { Document, Schema } from 'mongoose';

// User interface (matches the one in routes/user.ts)
export interface User {
  id: string; // name to lowercase and spaces converted to hyphens
  name: string;
  character: 'bunny' | 'cat' | 'dog' | 'giraffe' | 'penguin';
}

// Mongoose document interface
export interface UserDocument extends Document {
  id: string;
  name: string;
  character: 'bunny' | 'cat' | 'dog' | 'giraffe' | 'penguin';
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    character: {
      type: String,
      required: true,
      enum: ['bunny', 'cat', 'dog', 'giraffe', 'penguin'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disable __v field
  },
);

// Add indexes for better query performance
userSchema.index({ name: 1 });
userSchema.index({ character: 1 });

// Pre-save middleware to generate id from name (only if not already set)
userSchema.pre('save', function (next) {
  if (this.isNew && !this.id) {
    this.id = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Instance methods
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

// Create and export the User model
export const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
