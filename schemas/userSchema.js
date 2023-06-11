import mongoose from "mongoose";
import bcrypt from "mongoose-bcrypt";

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 25,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
    },
    points: {
      type: Number,
    },
    avatar: {
      type: String,
      default: "avatar.png",
    },
    activationToken: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
    timestamps: true,
  }
);

userSchema.plugin(bcrypt, {
  fields: ["password"],
  rounds: 10,
});

const User = mongoose.model("User", userSchema);

export default User;
