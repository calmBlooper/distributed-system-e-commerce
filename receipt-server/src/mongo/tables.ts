import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';

const MONGO_DB = "receipt";
const REPLICASET_NAME = "receiptReplicaSet";
const MONGO_NODES_MAP = new Map([
    ['receipt_1', '9052'],
    ['receipt_2', '9152'],
    ['receipt_3', '9252'],
]);

const MONGO_ADDRESSES = Array.from(MONGO_NODES_MAP)
    .map(([key, value]) => `${key}:${value}`)
    .join(',');

const mongoUri =`mongodb://${MONGO_ADDRESSES}/${MONGO_DB}?replicaSet=${REPLICASET_NAME}&readPreference=secondaryPreferred`

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});

export interface ReceiptItem{
    price: number;
    quantity: number;
    product: string;
}

export interface ReceiptDocument extends Document {
    _id: Types.ObjectId;
    user: string;
    date: Date;
    items: ReceiptItem[];
};

interface ReceiptModel extends Model<ReceiptDocument> {};

const receiptSchema = new Schema<ReceiptDocument, ReceiptModel>({
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    items: [{
        type: {
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            product: { type: String, required: true },
        }
    }]
});

export const Receipt = model('Receipt', receiptSchema);
