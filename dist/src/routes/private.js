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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../constant");
const Student_1 = __importDefault(require("../models/Student"));
const router = (0, express_1.Router)();
router.post("/isAuthenticated", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization: token } = req.headers;
        if (!token) {
            return res.status(400).send({ code: "tokenNotReceived" });
        }
        let verified = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_TOKEN);
        if (verified.role === constant_1.STUDENT_USER_ROLE) {
            const student = yield Student_1.default.findOne({ phone: verified.id });
            // append the student data to the verified object
            verified = Object.assign(Object.assign({}, verified), { name: student === null || student === void 0 ? void 0 : student.name, class: student === null || student === void 0 ? void 0 : student.class });
        }
        res.status(200).send({ code: "tokenValid", message: verified });
    }
    catch (err) {
        res.status(400).send("tokenInvalid");
    }
}));
exports.default = router;
//# sourceMappingURL=private.js.map