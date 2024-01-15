import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  phone: string;
  name: string;
  class: number;
}

const studentSchema: Schema<IStudent> = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    length: 10,
  },
  name: {
    type: String,
  },
  class: {
    type: Number,
  },
});

const StudentModel = mongoose.model<IStudent>("students", studentSchema);
export default StudentModel;
