import { Document, Schema, model, Types } from "mongoose";

export interface IVisitdProfiles extends Document {
  studentPhone: string;
  studentProfileId: Types.ObjectId;
  teacherProfileId: Types.ObjectId;
  accessTime: Date;
}

const VisitdProfilesSchema = new Schema<IVisitdProfiles>({
  studentPhone: {
    type: String,
    required: true,
  },
  studentProfileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  teacherProfileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accessTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

VisitdProfilesSchema.index({ studentProfileId: 1, teacherProfileId: 1 });

const VisitdProfiles = model<IVisitdProfiles>("VisitdProfiles", VisitdProfilesSchema);

export default VisitdProfiles;
