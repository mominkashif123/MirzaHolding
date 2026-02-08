import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserHoldingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fund: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    units: { type: Number, required: true, default: 0 },
    investedAmount: { type: Schema.Types.Decimal128, required: true, default: 0 },
}, { timestamps: true });

UserHoldingSchema.index({ user: 1, fund: 1 }, { unique: true });

export default mongoose.model("UserHolding", UserHoldingSchema);
