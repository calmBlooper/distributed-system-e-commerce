import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';

const MONGO_DB = "receipt";

const shards = ["127.0.0.1:27217","127.0.0.1:27218"]


const MONGO_ADDRESSES = shards
    .join(',');



const mongoUri =`mongodb://${MONGO_ADDRESSES}/${MONGO_DB}?readPreference=secondaryPreferred`

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
