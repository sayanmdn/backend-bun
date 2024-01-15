"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subjectClassesSchema = new mongoose_1.default.Schema({
    subject: String,
    fromClass: Number,
    toClass: Number,
});
const userSchema = new mongoose_1.default.Schema({
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
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map