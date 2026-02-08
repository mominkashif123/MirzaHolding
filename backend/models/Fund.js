import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FundSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: "Equity" },
}, { timestamps: true });

export default mongoose.model("Fund", FundSchema);
