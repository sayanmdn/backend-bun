"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../constant");
const OTP_1 = __importDefault(require("../models/OTP"));
const userValidation = __importStar(require("../validation/user"));
const Student_1 = __importDefault(require("../models/Student"));
const lodash_1 = require("lodash");
const router = (0, express_1.Router)();
router.post("/access", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation.checkStudentRegistration(req.body);
    if (!(0, lodash_1.isNil)(error)) {
        return res.send({
            code: "validationFalse",
            message: error.details[0].message,
        });
    }
    const otpFromDB = yield OTP_1.default.find({ email: req.body.phone });
    if (otpFromDB[otpFromDB.length - 1].otp !== req.body.otp)
        return res.send("OTP did not match");
    const token = jsonwebtoken_1.default.sign({ id: req.body.phone, role: constant_1.STUDENT_USER_ROLE }, process.env.SECRET_JWT_TOKEN);
    // check if the student is already registered
    const student = yield Student_1.default.findOne({ phone: req.body.phone });
    if (student)
        return res.json({ code: constant_1.SUCCESS_CODE, token, student });
    // register the student
    const newStudent = new Student_1.default({
        phone: req.body.phone,
    });
    return res.send({ code: constant_1.SUCCESS_CODE, token, student: yield newStudent.save() });
}));
router.post("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation.checkStudentUpdate(req.body);
    if (!(0, lodash_1.isNil)(error)) {
        return res.send({
            code: "validationFalse",
            message: error.details[0].message,
        });
    }
    // check if the token is valid
    try {
        const { id } = jsonwebtoken_1.default.verify(req.body.token, process.env.SECRET_JWT_TOKEN);
        if (id !== req.body.phone)
            return res.send({ code: "tokenInvalid" });
    }
    catch (_err) {
        res.send({ code: "tokenInvalid" });
    }
    // check if the student is already registered
    const student = yield Student_1.default.findOne({ phone: req.body.phone });
    if (!student)
        return res.json({ code: "notRegistered" });
    // update the student
    return res.send({
        code: constant_1.SUCCESS_CODE,
        student: yield Student_1.default.findOneAndUpdate({ phone: req.body.phone }, req.body, { new: true }),
    });
}));
exports.default = router;
//# sourceMappingURL=students.js.map