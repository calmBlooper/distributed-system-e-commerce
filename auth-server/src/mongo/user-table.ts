import mongoose, {Schema, model, connect, ConnectOptions, Model} from 'mongoose';

export interface UserDocument extends Document {
    _id: string;
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
