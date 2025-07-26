import mongoose from "mongoose";
import resultSchema from "./result.model.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  enrollment: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "faculty", "examcell", "admin"],
  },
  branch: {
    type: String,
    required: function () {
      return this.role === "student";
    }
  },
  year: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  // currentYear: {
  //   type: Number,
  //   required: function (){
  //     return this.role !== "student";
  //   }
  // },
  result: [resultSchema],
  section: {
    type: String,
    required: function () {
      return this.role === "student"
    },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
