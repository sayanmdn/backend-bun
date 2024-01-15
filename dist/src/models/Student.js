"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
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
const StudentModel = mongoose_1.default.model("students", studentSchema);
exports.default = StudentModel;
//# sourceMappingURL=Student.js.map