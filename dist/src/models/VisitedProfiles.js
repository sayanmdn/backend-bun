"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VisitdProfilesSchema = new mongoose_1.Schema({
    studentPhone: {
        type: String,
        required: true,
    },
    studentProfileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    teacherProfileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    accessTime: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
VisitdProfilesSchema.index({ studentProfileId: 1, teacherProfileId: 1 });
const VisitdProfiles = (0, mongoose_1.model)("VisitdProfiles", VisitdProfilesSchema);
exports.default = VisitdProfiles;
//# sourceMappingURL=VisitedProfiles.js.map