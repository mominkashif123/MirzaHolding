import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuarterReportSchema = new Schema({
    quarter: { 
        type: String, 
        required: true, 
        enum: ['Q1', 'Q2', 'Q3', 'Q4'],
        unique: true 
    },
    year: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    size: { 
        type: String 
    },
    pdfData: { 
        type: Buffer, 
        required: true 
    },
    contentType: { 
        type: String, 
        default: 'application/pdf' 
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('QuarterReport', QuarterReportSchema);
