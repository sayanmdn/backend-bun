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
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Data_1 = __importDefault(require("../models/Data"));
const OTP_1 = __importDefault(require("../models/OTP"));
const News_1 = __importDefault(require("../models/News"));
const otpEmail_1 = __importDefault(require("../assets/otpEmail"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const userValidation = __importStar(require("../validation/user"));
const newsapi_1 = __importDefault(require("newsapi"));
const openai_1 = __importDefault(require("openai"));
const lodash_1 = require("lodash");
const constant_1 = require("../constant");
const newsapi = new newsapi_1.default("8c4fe58fb02945eb9469d8859addd041");
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    region: "ap-southeast-1",
});
const router = express_1.default.Router();
const serializeFunction = (inputArray) => {
    return inputArray.map(({ subject, selectedFromRange, selectedToRange }) => ({
        subject,
        fromClass: selectedFromRange,
        toClass: selectedToRange,
    }));
};
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation.checkSignup(req.body);
    if (error != null) {
        return res.send({
            code: "validationFalse",
            message: error.details[0].message,
        });
    }
    if (req.body.role === "TEACHER") {
        // Check OTP
        const otpFromDB = yield OTP_1.default.find({ email: req.body.phone });
        if (otpFromDB[otpFromDB.length - 1].otp !== req.body.otp)
            return res.send("OTP did not match");
        if (req.body.phone) {
            const phoneExist = yield User_1.default.findOne({ phone: req.body.phone });
            if (phoneExist)
                return res.status(400).send("Phone number already exists");
        }
        else {
            return res.status(400).send("field 'phone' is missing");
        }
        // hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const user = new User_1.default({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email || undefined,
            password: hashedPassword,
            phone: req.body.phone || undefined,
            subjects: req.body.subjects.map((element) => (0, lodash_1.toUpper)(element.subject.trim())) ||
                undefined,
            subjectClasses: serializeFunction(req.body.subjects) || undefined,
            college: req.body.college || undefined,
            subjectEnrolled: req.body.subjectEnrolled || undefined,
            degreeEnrolled: req.body.degreeEnrolled || undefined,
        });
        try {
            const saveUser = yield user.save();
            res.send({
                code: "userCreated",
                message: {
                    id: saveUser._id,
                    name: saveUser.name,
                },
            });
        }
        catch (err) {
            res.status(400).send(err);
        }
        return;
    }
    // Check OTP
    const otpFromDB = yield OTP_1.default.find({ email: req.body.email });
    if (otpFromDB[otpFromDB.length - 1].otp !== req.body.otp)
        return res.send("OTP did not match");
    if (!(0, lodash_1.isEmpty)(req.body.email)) {
        const emailExist = yield User_1.default.findOne({ email: req.body.email });
        if (emailExist)
            return res.status(400).send("Email already exists");
    }
    else {
        return res.status(400).send("Email is required");
    }
    // hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
    const user = new User_1.default({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone || undefined,
    });
    try {
        const saveUser = yield user.save();
        res.send({
            code: "userCreated",
            message: {
                id: saveUser._id,
                name: saveUser.name,
            },
        });
    }
    catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation.checkLogin(req.body);
    if (error != null) {
        return res
            .status(400)
            .send({ code: "validationFalse", message: error.details[0].message });
    }
    const userEmail = req.body.email;
    let userByEmail = undefined;
    // check if email already exists
    try {
        userByEmail = yield User_1.default.findOne({ email: userEmail });
    }
    catch (e) {
        console.log("Error fetching from DB", e);
    }
    if (!userByEmail)
        return res.status(400).send("Email does not exist");
    // hash passwords
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
    const validPass = yield bcryptjs_1.default.compare(req.body.password, userByEmail.password);
    if (!validPass)
        return res.status(400).send("Invalid password");
    const token = jsonwebtoken_1.default.sign({
        id: userByEmail._id,
        name: userByEmail.name,
        role: userByEmail.role || "USER",
    }, process.env.SECRET_JWT_TOKEN);
    return res.header("auth-token", token).send({
        code: "Loggedin",
        token: token,
        user: {
            id: userByEmail._id,
            name: userByEmail.name,
            role: userByEmail.role || "USER",
        },
    });
}));
router.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.body;
    if (!token)
        return res.status(400).send({ code: "tokenNotReceived", message: token });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_TOKEN);
        var givenUserId = verified.id;
    }
    catch (err) {
        res.status(400).send("tokenInvalid" + err);
        return;
    }
    const data = new Data_1.default({
        userId: givenUserId,
        data: req.body.data,
    });
    try {
        const savedData = yield data.save();
        console.log("Data save success log: " + savedData);
        res.send({
            code: "dataSaved",
            message: {
                id: savedData._id,
            },
        });
    }
    catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}));
router.post("/getdata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token)
        return res.status(400).send({ code: "tokenNotReceived", message: token });
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_TOKEN);
        const returnedData = yield Data_1.default.find({ userId: id });
        if (returnedData)
            return res.status(200).send(returnedData);
        res.status(200).send({ code: "dataNotFound", message: returnedData });
    }
    catch (err) {
        res.status(400).send("tokenInvalid" + err);
    }
}));
router.post("/otpsend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.role === constant_1.TEACHER_USER_ROLE ||
            req.body.role === constant_1.STUDENT_USER_ROLE) {
            const { error } = userValidation.checkPhone(req.body);
            if (error != null) {
                console.log("OTP service email validation log: " + error);
                return res.send({
                    code: "validationFalse",
                    message: error.details[0].message,
                });
            }
            const rand = Math.floor(100000 + Math.random() * 900000);
            // create a new instance of the AWS.SES
            // JS SDK v3 does not support global configuration.
            // Codemod has attempted to pass values to each service client in this file.
            // You may need to update clients outside of this file, if they use global config.
            aws_sdk_1.default.config.update({
                accessKeyId: process.env.AWS_ACCESSKEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
                region: "ap-south-1",
            });
            const sns = new aws_sdk_1.default.SNS({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESSKEY,
                    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
                },
                region: "ap-southeast-1",
            });
            const processedNumber = req.body.phone.length === 10
                ? "+91".concat(req.body.phone)
                : req.body.phone;
            // Define the message parameters
            const params = {
                Message: "Hello, You OTP for FindMyTeahcer is " + rand,
                PhoneNumber: processedNumber, // Replace with the recipient's phone number
            };
            // Send the SMS
            sns.publish(params, (err, _data) => {
                if (err) {
                    console.error("Error sending SMS:", err);
                    return res.status(400).send(err);
                }
            });
            // save OTP in DB
            const otp = new OTP_1.default({
                email: req.body.phone,
                otp: rand.toString(),
            });
            try {
                const savedOtp = yield otp.save();
                res.send({
                    code: "otpSent",
                    message: {
                        id: savedOtp._id,
                        email: savedOtp.email,
                    },
                });
            }
            catch (err) {
                res.status(400).send(err);
            }
            return;
        }
        // Email OTP Send
        const { error } = userValidation.checkEmail(req.body);
        if (error != null) {
            return res.send({
                code: "validationFalse",
                message: error.details[0].message,
            });
        }
        const rand = Math.floor(100000 + Math.random() * 900000);
        // save OTP in DB
        const otp = new OTP_1.default({
            email: req.body.email,
            otp: rand.toString(),
        });
        // create a new instance of the AWS.SES
        // JS SDK v3 does not support global configuration.
        // Codemod has attempted to pass values to each service client in this file.
        // You may need to update clients outside of this file, if they use global config.
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_ACCESSKEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
            region: "ap-southeast-1",
        });
        const ses = new aws_sdk_1.default.SES({
            // The key apiVersion is no longer supported in v3, and can be removed.
            // @deprecated The client uses the "latest" apiVersion.
            apiVersion: "2010-12-01",
            credentials: {
                accessKeyId: process.env.AWS_ACCESSKEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
            },
            region: "ap-southeast-1",
        });
        const params = {
            Destination: {
                ToAddresses: [req.body.email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: (0, otpEmail_1.default)(rand.toString()),
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Your OTP is here",
                },
            },
            Source: "info@mail.sayantanmishra.com",
        };
        const sendEmail = ses.sendEmail(params);
        try {
            yield sendEmail;
        }
        catch (error) {
            console.log(error);
        }
        // OTP save to DB
        try {
            const savedOtp = yield otp.save();
            res.send({
                code: "otpSent",
                message: {
                    id: savedOtp._id,
                    email: savedOtp.email,
                },
            });
        }
        catch (err) {
            res.status(400).send(err);
            console.log(err);
        }
    }
    catch (err) {
        console.log("Error in OTP send: " + JSON.stringify(err));
    }
}));
router.get("/news", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if present in DB
    const returnedData = yield News_1.default.find({
        time: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (returnedData.length > 0) {
        res.send(returnedData[0].data);
        return;
    }
    // fetch the news api
    const result = yield newsapi.v2.topHeadlines({
        category: "business",
        language: "en",
        country: "in",
    });
    // console.log(result);
    const descriptions = result.articles.map((e) => e.description);
    // get curated data form openai
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = `Summarize the following news article descriptions in a better way and combine them in a single paragraph then devide them in bullet points.
    Add more context to the points and also add the probable circumstance or impact for this in the same point itself. example: '- first point.- second point.- third point.`;
    const chatCompletion = yield openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt + " \n".concat(descriptions.join("\n ")),
            },
        ],
        model: "gpt-3.5-turbo-16k-0613", // gpt-3.5-turbo-16k-0613  gpt-3.5-turbo
    });
    // store data in Mongo DB
    const data = new News_1.default({
        data: chatCompletion.choices[0].message.content,
    });
    yield data.save();
    // send the generated data
    res.send(chatCompletion.choices[0].message.content);
}));
router.post("/write", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const { authorization: token } = req.headers;
    if (!token)
        return res.status(400).send({ code: "tokenNotReceived", message: token });
    try {
        const { id: userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_TOKEN);
        const user = yield User_1.default.find({ userId });
    }
    catch (err) {
        res.status(400).send("tokenInvalid" + err);
    }
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = `Write this in a better way. '${text}`;
    try {
        const chatCompletion = yield openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "gpt-3.5-turbo", // gpt-3.5-turbo-16k-0613  gpt-3.5-turbo
        });
        // send the generated data
        res.send({ response: chatCompletion.choices[0].message.content });
    }
    catch (e) {
        res.status(400).send("Unable to process the request.");
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map