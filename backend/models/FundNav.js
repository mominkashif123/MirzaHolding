import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FundNavSchema = new Schema({
    fund: { type: Schema.Types.ObjectId, ref: "Fund", required: true },
    date: { type: Date, required: true },
    nav: { type: Schema.Types.Decimal128, required: true },
}, { timestamps: true });

FundNavSchema.index({ fund: 1, date: 1 }, { unique: true });

export default mongoose.model("FundNav", FundNavSchema);
