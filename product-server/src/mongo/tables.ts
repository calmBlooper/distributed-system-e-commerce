import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';


const MONGO_DB = "product";
const REPLICASET_NAME = "productReplicaSet";
const MONGO_NODES_MAP = new Map([
    ['product_1', '9042'],
    ['product_2', '9142'],
    ['product_3', '9242'],
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
    seller: String;
    archive: boolean;
};

interface ProductModel extends Model<ProductDocument> {};

const productSchema = new Schema<ProductDocument, ProductModel>({
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

export const Product = model('Product', productSchema);
