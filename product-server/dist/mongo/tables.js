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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MONGO_IP = "localhost";
const MONGO_PORT = "27017";
const MONGO_DB = "product";
const mongoUri = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;
mongoose_1.default.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("mongodb is connected");
}).catch((error) => {
    console.log("mongodb not connected");
    console.log(error);
});
var Category;
(function (Category) {
    Category["House"] = "House";
    Category["Food"] = "Food";
    Category["Sport"] = "Sport";
    Category["Jewelry"] = "Jewelry";
    Category["Electronics"] = "Electronics";
    Category["Clothing"] = "Clothing";
    Category["Books"] = "Electronics";
})(Category || (Category = {}));
;
;
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: Object.keys(Category)
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    archive: {
        type: Boolean,
        required: true,
        default: false
    }
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
//# sourceMappingURL=tables.js.map