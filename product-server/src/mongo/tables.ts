import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';

const MONGO_IP = "localhost";
const MONGO_PORT = "27017";
const MONGO_DB = "product";

const mongoUri = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});

enum Category {
    House = 'House',
    Food = 'Food',
    Sport = 'Sport',
    Jewelry = 'Jewelry',
    Electronics = 'Electronics',
    Clothing = 'Clothing',
    Books = 'Electronics'
}


export interface ProductDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    category: Category;
    price: number;
    quantity: number;
    seller: Types.ObjectId;
};

interface ProductModel extends Model<ProductDocument> {};

const productSchema = new Schema<ProductDocument, ProductModel>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Object.keys(Category),
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    seller: {
        type: String,
        required: true,
    }
});

export const Product = model('Product', productSchema);
