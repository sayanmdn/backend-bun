"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStudentUpdate = exports.checkStudentRegistration = exports.checkPhone = exports.checkEmail = exports.checkLogin = exports.checkSignup = void 0;
const joi_1 = __importDefault(require("joi"));
// Signup Validation
const signupValidationSchema = joi_1.default.object({
    role: joi_1.default.string(),
    name: joi_1.default.string().min(8).required(),
    email: joi_1.default.string().min(8).email(),
    phone: joi_1.default.string().length(10),
    college: joi_1.default.string(),
    subjectEnrolled: joi_1.default.string(),
    degreeEnrolled: joi_1.default.string(),
    otp: joi_1.default.string().length(6).required(),
    password: joi_1.default.string().min(8).required(),
    subjects: joi_1.default.array().items(joi_1.default.object({
        subject: joi_1.default.string().min(2).required(),
        selectedFromRange: joi_1.default.number().required(),
        selectedToRange: joi_1.default.number().required(),
    })),
});
const checkSignup = (body) => {
    return signupValidationSchema.validate(body);
};
exports.checkSignup = checkSignup;
// Login Validation
const loginValidationSchema = joi_1.default.object({
    email: joi_1.default.string().min(8).required().email(),
    password: joi_1.default.string().min(8).required(),
});
const checkLogin = (body) => {
    return loginValidationSchema.validate(body);
};
exports.checkLogin = checkLogin;
// Email Validation
const emailValidationSchema = joi_1.default.object({
    email: joi_1.default.string().min(8).required().email(),
});
// Phone number validation
const phoneValidationSchema = joi_1.default.object({
    phone: joi_1.default.string().length(10).required(),
    role: joi_1.default.string(),
});
const checkPhone = (body) => {
    return phoneValidationSchema.validate(body);
};
exports.checkPhone = checkPhone;
const checkEmail = (body) => {
    return emailValidationSchema.validate(body);
};
exports.checkEmail = checkEmail;
// student registration validation schema
const studentRegistrationValidationSchema = joi_1.default.object({
    phone: joi_1.default.string().length(10).required(),
    otp: joi_1.default.string().length(6).required(),
});
const checkStudentRegistration = (body) => {
    return studentRegistrationValidationSchema.validate(body);
};
exports.checkStudentRegistration = checkStudentRegistration;
const checkStudentUpdate = (body) => {
    return joi_1.default.object({
        phone: joi_1.default.string().length(10).required(),
        token: joi_1.default.string().required(),
        name: joi_1.default.string().min(8).required(),
        class: joi_1.default.number().required(),
    }).validate(body);
};
exports.checkStudentUpdate = checkStudentUpdate;
//# sourceMappingURL=user.js.map