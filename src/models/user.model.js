import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: [false, 'firstname required'] },
  lastName: { type: String, required: [false, 'lastname required'] },
  email: { type: String, required: [true, 'email address required'] },
  password: { type: String, required: [true, 'password required'] },
  confirmed: { type: Boolean, default: false },
  instagram: { type: String, default: "" },
  facebook: { type: String, default: "" },
  role: { type: String }
}, { timestamps: true });



// userSchema.post("save", (created) => {
// });

// userSchema.pre('save', (next) => {
//   next();
// })

export const User = model('user', userSchema, 'users');
