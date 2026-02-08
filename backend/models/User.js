import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, default: 0 },
    transactions: { type: [String], default: [] },
    premium: { type: Boolean, default: false },
    isMutual: { type: Boolean, default: false },
},
);

export default mongoose.model('User', UserSchema);
