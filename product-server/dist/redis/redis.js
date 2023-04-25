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
exports.ShoppingCart = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class ShoppingCart {
    constructor() {
        this.client = new ioredis_1.default({
            host: 'localhost',
            port: 6379,
        });
    }
    addItemToCart(cartId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItems = yield this.getCartItems(cartId);
            const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            }
            else {
                cartItems.push(item);
            }
            yield this.client.hset(cartId, 'items', JSON.stringify(cartItems));
        });
    }
    removeItemFromCart(cartId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItems = yield this.getCartItems(cartId);
            const updatedItems = cartItems.filter((cartItem) => cartItem.productId !== productId);
            yield this.client.hset(cartId, 'items', JSON.stringify(updatedItems));
        });
    }
    clearCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.del(cartId);
        });
    }
    getCartItems(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.hget(cartId, 'items');
            if (!data) {
                return [];
            }
            return JSON.parse(data);
        });
    }
}
exports.ShoppingCart = ShoppingCart;
//# sourceMappingURL=redis.js.map