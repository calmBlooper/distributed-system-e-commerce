import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';

const MONGO_IP = "localhost";
const MONGO_PORT = "27017";
const MONGO_DB = "receipt";

const mongoUri = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});

export interface ReceiptItem{
    price: number;
    quantity: number;
    product: Types.ObjectId;
}

export interface ReceiptDocument extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    date: Date;
    items: ReceiptItem[];
};

interface ReceiptModel extends Model<ReceiptDocument> {};

const receiptSchema = new Schema<ReceiptDocument, ReceiptModel>({
    user: {
        type: Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    items: {
        type: {
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            product: { type: Types.ObjectId, required: true },
        },
        required: true,
    }
});

export const Receipt = model('Receipt', receiptSchema);
