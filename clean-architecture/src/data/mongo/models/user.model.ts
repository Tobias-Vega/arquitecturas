import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    unique: true,
  },
})

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret, options) {
    delete ret._id
  }
})

export const UserModel = mongoose.model('User', userSchema)