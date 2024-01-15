import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
    email: string;
    otp: string;
    time: Date;
}

const otpSchema: Schema<IOTP> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 128,
        min: 8,
    },
    otp: {
        type: String,
        required: true,
        validate: /^[0-9]{6}$/, // Validation for exactly 6 digits
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

const OTPModel = mongoose.model<IOTP>("OTP", otpSchema);
export default OTPModel;
