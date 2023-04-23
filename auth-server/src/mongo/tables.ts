import mongoose, {Schema, model, ConnectOptions, Model, Types} from 'mongoose';

const MONGO_IP = "localhost";
const MONGO_PORT = "27017";
const MONGO_DB = "auth";

const mongoUri = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name?: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'seller';
};

interface UserModel extends Model<UserDocument> {};

const userSchema = new Schema<UserDocument, UserModel>({
    name: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'seller'],
        default: 'user',
    }
});

export const User = model('User', userSchema);
