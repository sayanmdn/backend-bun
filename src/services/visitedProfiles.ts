import VisitdProfiles from "../models/VisitedProfiles";
import { Types } from "mongoose";

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
async function getVisitedTeachersCount(studentProfileId: string): Promise<number> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const result = await VisitdProfiles.aggregate([
    {
      $match: {
        studentProfileId: new Types.ObjectId(studentProfileId),
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
  } else {
    return 0; // No teachers visited
  }
}

export { getVisitedTeachersCount };
