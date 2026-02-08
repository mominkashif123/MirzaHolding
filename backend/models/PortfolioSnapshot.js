import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PortfolioSnapshotSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    totalValue: { type: Schema.Types.Decimal128, required: true },
}, { timestamps: true });

PortfolioSnapshotSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("PortfolioSnapshot", PortfolioSnapshotSchema);
