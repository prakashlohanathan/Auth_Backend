import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  otp: {
    type: "object",
  },
});

let User = mongoose.model("User", userSchema);
export { User };
