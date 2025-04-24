import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRegistration {
  email: string;
  password: string;
  avatar?: string;
  verified?: boolean;
}

export type IUserPreferences = {
  selfDescription: string;
  work: string[];
  country: string;
  toolStack: string[];
  goals: string[];
};

export interface IUser extends Document {
  email: string;
  password: string;
  avatar?: {
    id: string;
    url: string;
  };
  verified: boolean;
  lastLogin: Date;
  lastPasswordReset: Date;
  googleRegistered: boolean;
  prefernces?: {
    selfDescription: string;
    work: string[];
    country: string;
    toolStack: string[];
    goals: string[];
  };
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    lastPasswordReset: {
      type: Date,
      default: null,
    },
    googleRegistered: {
      type: Boolean,
      default: false,
    },
    prefernces: {
      selfDescription: { type: String },
      work: [{ type: String }],
      country: { type: String },
      toolStack: [{ type: String }],
      goals: [{ type: String }],
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
