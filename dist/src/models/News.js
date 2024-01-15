"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const newsSchema = new mongoose_1.default.Schema({
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
const NewsModel = mongoose_1.default.model("News", newsSchema);
exports.default = NewsModel;
//# sourceMappingURL=News.js.map