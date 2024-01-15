import mongoose, { Schema, Document } from "mongoose";

interface ISubjectClass {
  subject: string;
  fromClass: number;
  toClass: number;
}

const subjectClassesSchema = new mongoose.Schema({
  subject: String,
  fromClass: Number,
  toClass: Number,
});

export interface IUser extends Document {
  name: string;
  role?: string;
  email?: string;
  password: string;
  time: Date;
  phone?: string;
  subjects?: string[];
  subjectClasses: ISubjectClass[];
  college?: string;
  subjectEnrolled?: string;
  degreeEnrolled?: string;
  profileViews?: number;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
  },
  role: {
    type: String,
  },
  email: {
    type: String,
    required: false,
    max: 128,
    min: 8,
  },
  password: {
    type: String,
    required: true,
    max: 128,
    min: 8,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
  },
  subjects: {
    type: [String],
  },
  subjectClasses: {
    type: [subjectClassesSchema],
  },
  college: {
    type: String,
  },
  subjectEnrolled: {
    type: String,
  },
  degreeEnrolled: {
    type: String,
  },
  profileViews: {
    type: Number,
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
