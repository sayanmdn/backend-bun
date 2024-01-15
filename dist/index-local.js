"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const private_1 = __importDefault(require("./src/routes/private"));
const teachers_1 = __importDefault(require("./src/routes/teachers"));
const students_1 = __importDefault(require("./src/routes/students"));
const constant_1 = require("./src/constant");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const port = 8080;
app.use("/user", auth_1.default);
app.use("/post", private_1.default);
app.use("/teachers", teachers_1.default);
app.use("/students", students_1.default);
app.get("/", (_req, res) => {
    res.send(constant_1.DEFAULT_SERVER_RESPONSE);
});
const username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://${username}:${mongo_password}@backend-serverless.3e0kv62.mongodb.net/portfolio-db?retryWrites=true&w=majority`;
try {
    mongoose_1.default.connect(uri);
    const dbConnection = mongoose_1.default.connection;
    dbConnection.once("open", function () {
        console.log("MongoDB database connection established successfully");
    });
}
catch (error) {
    console.log("Error while connection Mongodb Atlas ", error);
}
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
//# sourceMappingURL=index-local.js.map