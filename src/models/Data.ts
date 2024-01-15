import mongoose, { Schema, Document } from "mongoose";

export interface IData extends Document {
    userId: mongoose.Types.ObjectId;
    data: Record<string, any>;
    time: Date;
}

const dataSchema: Schema<IData> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        min: 6,
    },
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

const DataModel = mongoose.model<IData>("Data", dataSchema);
export default DataModel;
