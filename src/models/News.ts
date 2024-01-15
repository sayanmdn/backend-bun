import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  data: Record<string, any>;
  time: Date;
}

const newsSchema: Schema<INews> = new mongoose.Schema({
  data: {
    type: Object,
    max: 128,
    min: 8,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const NewsModel = mongoose.model<INews>("News", newsSchema);
export default NewsModel;
