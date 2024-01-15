import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { STUDENT_USER_ROLE, SUCCESS_CODE } from "../constant";
import otpModel from "../models/OTP";
import * as userValidation from "../validation/user";
import StudentModel from "../models/Student";
import { isNil } from "lodash";

const router = Router();

router.post("/access", async (req: Request, res: Response) => {
  const { error } = userValidation.checkStudentRegistration(req.body);
  if (!isNil(error)) {
    return res.send({
      code: "validationFalse",
      message: error.details[0].message,
    });
  }

  const otpFromDB = await otpModel.find({ email: req.body.phone });
  if (otpFromDB[otpFromDB.length - 1].otp !== req.body.otp) return res.send("OTP did not match");

  const token = jwt.sign({ id: req.body.phone, role: STUDENT_USER_ROLE }, process.env.SECRET_JWT_TOKEN);

  // check if the student is already registered
  const student = await StudentModel.findOne({ phone: req.body.phone });
  if (student) return res.json({ code: SUCCESS_CODE, token, student });

  // register the student
  const newStudent = new StudentModel({
    phone: req.body.phone,
  });

  return res.send({ code: SUCCESS_CODE, token, student: await newStudent.save() });
});

router.post("/update", async (req: Request, res: Response) => {
  const { error } = userValidation.checkStudentUpdate(req.body);
  if (!isNil(error)) {
    return res.send({
      code: "validationFalse",
      message: error.details[0].message,
    });
  }

  // check if the token is valid
  try {
    const { id } = jwt.verify(req.body.token, process.env.SECRET_JWT_TOKEN) as { id: string };
    if (id !== req.body.phone) return res.send({ code: "tokenInvalid" });
  } catch (_err) {
    res.send({ code: "tokenInvalid" });
  }

  // check if the student is already registered
  const student = await StudentModel.findOne({ phone: req.body.phone });
  if (!student) return res.json({ code: "notRegistered" });

  // update the student
  return res.send({
    code: SUCCESS_CODE,
    student: await StudentModel.findOneAndUpdate({ phone: req.body.phone }, req.body, { new: true }),
  });
});

export default router;
