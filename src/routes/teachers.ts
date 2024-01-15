import { Request, Response, Router } from "express";
import userModel, { IUser } from "../models/User";
import visitedProfilesModel from "../models/VisitedProfiles";
import { isEmpty } from "lodash";
import jwt from "jsonwebtoken";
import { ADMIN_PHONE_NUMBERS, TEACHER_USER_ROLE } from "../constant";
import { getVisitedTeachersCount } from "../services/visitedProfiles";
import StudentModel from "../models/Student";

const router = Router();

// seacrhes for the teachers with the given name or subject
router.post("/find", async (req: Request, res: Response) => {
  const { data } = req.body;

  // check if data is received
  if (isEmpty(data)) return res.status(400).send({ code: "empty" });

  // return all the users whole have role = TEACHER_USER_ROLE and name or subject matches the given data
  try {
    const returnedData = await userModel
      .find({
        $and: [
          {
            $or: [{ name: { $regex: new RegExp(data, "i") } }, { subjects: { $regex: new RegExp(data, "i") } }],
          },
          { role: TEACHER_USER_ROLE },
        ],
      })
      .sort({ profileViews: 1 });

    // remove password and phone from the returned data
    for (const obj of returnedData) {
      obj.password = undefined;
      obj.phone = undefined;
    }

    // return the data
    if (returnedData) return res.status(200).send(returnedData);

    // if no data is found
    res.status(200).send({ code: "notFound" });
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

// searches for the teacher with the given id
router.post("/findById", async (req: Request, res: Response) => {
  const { id: _id } = req.body as { id: string };
  const { authorization: token } = req.headers as { authorization: string | undefined };

  // check if id is received
  if (isEmpty(_id)) return res.status(400).send({ code: "empty" });

  // return the user with the given id
  try {
    // fetch the user with the given id
    const { _doc: returnedData } = (await userModel.findOne({ _id })) as Record<string, Record<string, unknown>>;

    if (!returnedData) return res.status(400).send({ code: "notFound" });

    // remove password from the returned data
    returnedData.password = undefined;

    // increment the profileViews by 1
    await userModel.updateOne({ _id: returnedData._id }, { $inc: { profileViews: 1 } });

    // check if token is received and valid
    if (token) {
      try {
        const { id: studentPhone } = jwt.verify(token, process.env.SECRET_JWT_TOKEN) as { id: string };
        const student = (await StudentModel.findOne({ phone: studentPhone })) as IUser;

        // push the visited profile to the database when the user is not the same
        if (returnedData._id !== student._id) {
          await visitedProfilesModel.create({
            teacherProfileId: returnedData._id,
            studentProfileId: student._id,
            studentPhone: returnedData.phone,
          });
        }

        // check how many times the user has visited the teacher's profiles in last 24 hours
        const visitedProfiles = await getVisitedTeachersCount(student._id);

        if (visitedProfiles > 5 && !ADMIN_PHONE_NUMBERS.includes(student.phone))
          return res.status(200).send({ ...returnedData, phone: undefined, numberOfvisitedProfiles: visitedProfiles });

        // return the data with phone
        return res.status(200).send({ ...returnedData, numberOfvisitedProfiles: visitedProfiles });
      } catch (err) {
        console.log(err);
      }
    }

    // return the data
    return res.status(200).send({ ...returnedData, numberOfvisitedProfiles: undefined, phone: undefined });
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

// return all the users whole have role = TEACHER_USER_ROLE in a paginated way
router.post("/list", async (req: Request, res: Response) => {
  const { authorization: token } = req.headers;
  const { page, limit } = req.body;

  // check if token is received
  if (!token) return res.status(400).send({ code: "tokenNotReceived", message: token });

  // check if token is valid
  try {
    jwt.verify(token, process.env.SECRET_JWT_TOKEN) as { id: string };
  } catch (err) {
    res.status(400).send("tokenInvalid" + err);
  }

  // check if page and limit is received
  if (isEmpty(page) || isEmpty(limit)) return res.status(400).send({ code: "empty" });

  // return all the users whole have role = TEACHER_USER_ROLE in a paginated way
  try {
    const returnedData = await userModel
      .find({ role: TEACHER_USER_ROLE })
      .skip(page * limit)
      .limit(limit);

    // remove password and phone from the returned data
    for (const obj of returnedData) {
      obj.password = null;
      obj.phone = null;
    }

    // return the data
    if (returnedData) return res.status(200).send(returnedData);

    // if no data is found
    res.status(200).send({ code: "notFound" });
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

export default router;
