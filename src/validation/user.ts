import Joi from "joi";

// Signup Validation
const signupValidationSchema = Joi.object({
  role: Joi.string(),
  name: Joi.string().min(8).required(),
  email: Joi.string().min(8).email(),
  phone: Joi.string().length(10),
  college: Joi.string(),
  subjectEnrolled: Joi.string(),
  degreeEnrolled: Joi.string(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().min(8).required(),
  subjects: Joi.array().items(
    Joi.object({
      subject: Joi.string().min(2).required(),
      selectedFromRange: Joi.number().required(),
      selectedToRange: Joi.number().required(),
    }),
  ),
});

const checkSignup = (body: any) => {
  return signupValidationSchema.validate(body);
};

// Login Validation
const loginValidationSchema = Joi.object({
  email: Joi.string().min(8).required().email(),
  password: Joi.string().min(8).required(),
});

const checkLogin = (body: any) => {
  return loginValidationSchema.validate(body);
};

// Email Validation
const emailValidationSchema = Joi.object({
  email: Joi.string().min(8).required().email(),
});

// Phone number validation
const phoneValidationSchema = Joi.object({
  phone: Joi.string().length(10).required(),
  role: Joi.string(),
});

const checkPhone = (body: any) => {
  return phoneValidationSchema.validate(body);
};

const checkEmail = (body: any) => {
  return emailValidationSchema.validate(body);
};

// student registration validation schema
const studentRegistrationValidationSchema = Joi.object({
  phone: Joi.string().length(10).required(),
  otp: Joi.string().length(6).required(),
});

const checkStudentRegistration = (body: any) => {
  return studentRegistrationValidationSchema.validate(body);
};

const checkStudentUpdate = (body: any) => {
  return Joi.object({
    phone: Joi.string().length(10).required(),
    token: Joi.string().required(),
    name: Joi.string().min(8).required(),
    class: Joi.number().required(),
  }).validate(body);
};

export { checkSignup, checkLogin, checkEmail, checkPhone, checkStudentRegistration, checkStudentUpdate };
