"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedTeachersCount = void 0;
const VisitedProfiles_1 = __importDefault(require("../models/VisitedProfiles"));
const mongoose_1 = require("mongoose");
/**
 * Retrieves the number of unique teacher profiles visited by a student profile
 * within the last 24 hours based on the VisitdProfiles schema.
 *
 * @async
 * @function
 * @param {string} studentProfileId - The unique identifier of the student's profile.
 * @returns {Promise<number>} A Promise that resolves to the count of unique teacher profiles visited.
 * @throws {Error} If there is an error during the aggregation pipeline or database operation.
 *
 * @example
 * const studentProfileId = 'your_student_profile_id_here';
 * getVisitedTeachersCount(studentProfileId)
 *   .then((count) => console.log(`Number of teachers visited in the last 24 hours: ${count}`))
 *   .catch((error) => console.error(error));
 */
function getVisitedTeachersCount(studentProfileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const result = yield VisitedProfiles_1.default.aggregate([
            {
                $match: {
                    studentProfileId: new mongoose_1.Types.ObjectId(studentProfileId),
                    accessTime: { $gte: yesterday },
                },
            },
            {
                $group: {
                    _id: "$teacherProfileId",
                    count: { $sum: 1 },
                },
            },
            {
                $count: "totalTeachersVisited",
            },
        ]);
        // Check if there are results and return the count
        if (result.length > 0) {
            return result[0].totalTeachersVisited;
        }
        else {
            return 0; // No teachers visited
        }
    });
}
exports.getVisitedTeachersCount = getVisitedTeachersCount;
//# sourceMappingURL=visitedProfiles.js.map