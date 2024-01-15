import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { STUDENT_USER_ROLE } from "../constant";
import StudentModel from "../models/Student";

const router = Router();

router.post("/isAuthenticated", async (req: Request, res: Response) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      return res.status(400).send({ code: "tokenNotReceived" });
    }

    let verified = jwt.verify(token, process.env.SECRET_JWT_TOKEN) as {
      id: string;
      role: string;
      name?: string;
      class?: number;
    };
    if (verified.role === STUDENT_USER_ROLE) {
      const student = await StudentModel.findOne({ phone: verified.id });
      // append the student data to the verified object
      verified = { ...verified, name: student?.name, class: student?.class };
    }
    res.status(200).send({ code: "tokenValid", message: verified });
  } catch (err) {
    res.status(400).send("tokenInvalid");
  }
});

export default router;
