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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_table_1 = require("./mongo/user-table");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_IP = "localhost";
const MONGO_PORT = "27017";
const MONGO_DB = "auth";
const mongoUri = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;
mongoose_1.default.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("mongodb is connected");
}).catch((error) => {
    console.log("mongodb not connected");
    console.log(error);
});
const app = (0, express_1.default)();
// use bodyParser middleware to parse request body
app.use(body_parser_1.default.json());
// handle user registration
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role } = req.body;
        // hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // create new user
        const user = new user_table_1.User({
            name: name,
            role: role,
            email: email,
            password: hashedPassword,
        });
        // save user to database
        yield user.save();
        // generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, 'mysecretkey');
        // send token to client
        return res.json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
// handle user login
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // find user by email
        const user = yield user_table_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // compare password with hash
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, 'mysecretkey');
        // send token to client
        return res.json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
// dummy protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
    return res.json({ message: 'This is a protected endpoint' });
});
// middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jsonwebtoken_1.default.verify(token, 'mysecretkey', (error, user) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req["user"] = user;
        next();
    });
}
// start server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
//# sourceMappingURL=app.js.map