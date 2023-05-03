const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: [true, 'Email já está cadastrado!'],
    require: true
  }
}, { timestamps: true });

module.exports = model('User', userSchema);