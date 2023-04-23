"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "secretkey";
var Category;
(function (Category) {
    Category["House"] = "House";
    Category["Food"] = "Food";
})(Category || (Category = {}));
console.log(Object.keys(Category));
const app = (0, express_1.default)();
// use bodyParser middleware to parse request body
app.use(body_parser_1.default.json());
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
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (error, user) => {
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