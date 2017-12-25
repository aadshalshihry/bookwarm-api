import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import uniqueValidator from 'mongoose-unique-validator';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  cover: { type: String, required: true },
  goodreadId: { type: String },
  pages: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  hasFinished: { type: Boolean, default: false }
});

// schema.plugin(uniqueValidator, { message: 'This email is already taken'});

export default mongoose.model('Book', schema);