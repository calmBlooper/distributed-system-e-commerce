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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tables_1 = require("./mongo/tables");
const redis_1 = require("./redis/redis");
require("express-async-errors");
const JWT_SECRET = "secretkey";
const app = (0, express_1.default)();
const cart = new redis_1.ShoppingCart();
app.use(body_parser_1.default.json());
app.post('/product', authenticateToken, authenticateSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, quantity } = req.body;
    const product = new tables_1.Product({
        name: name,
        category: category,
        price: price,
        quantity: quantity,
        seller: req.user.userId
    });
    yield product.save();
    return res.json({ id: product._id });
}));
app.delete('/product/:id', authenticateToken, authenticateSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield tables_1.Product.findOneAndUpdate({ _id: req.params.id, seller: userId }, { archive: true });
    return res.status(200).json({ msg: 'Product archived' });
}));
app.get('/product/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield tables_1.Product.findOne({ _id: req.params.id });
    return res.json({ name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        seller: product.seller,
        archive: product.archive,
    });
}));
app.post('/cart', authenticateToken, authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    const product = yield tables_1.Product.findOne({ _id: productId });
    if (quantity > product.quantity) {
        return res.status(404).json({ msg: 'Quantity too large' });
    }
    if (product.archive) {
        return res.status(404).json({ msg: 'Product is archived' });
    }
    const cartItem = {
        productId: productId,
        quantity: quantity,
        price: product.price
    };
    yield cart.addItemToCart(userId, cartItem);
    return res.status(200).json();
}));
app.get('/cart', authenticateToken, authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const userCart = yield cart.getCartItems(userId);
    return res.status(200).json(userCart);
}));
app.delete('/cart', authenticateToken, authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield cart.clearCart(userId);
    return res.status(200).json({ msg: "Cart deleted" });
}));
function authenticateSeller(req, res, next) {
    if (req.user.role !== 'seller')
        return res.status(403).json({ message: 'Must be seller' });
    next();
}
function authenticateUser(req, res, next) {
    if (req.user.role !== 'user')
        return res.status(403).json({ message: 'Must be user' });
    next();
}
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
app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});
const port = process.argv[2];
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=app.js.map