import QuarterReport from '../models/QuarterReport.js';

// Upload or update a quarter report
export const uploadQuarterReport = async (req, res) => {
    try {
        const { quarter, year, title, size, pdfBase64 } = req.body;

        if (!quarter || !year || !title || !pdfBase64) {
            return res.status(400).json({ error: 'Missing required fields: quarter, year, title, and pdfBase64 are required.' });
        }

        // Validate quarter
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            return res.status(400).json({ error: 'Quarter must be Q1, Q2, Q3, or Q4.' });
        }

        // Convert base64 to Buffer
        // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
        const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        // Check if report already exists
        const existingReport = await QuarterReport.findOne({ quarter });

        if (existingReport) {
            // Update existing report
            existingReport.year = year;
            existingReport.title = title;
            existingReport.size = size || existingReport.size;
            existingReport.pdfData = pdfBuffer;
            existingReport.uploadedAt = new Date();
            await existingReport.save();
            return res.status(200).json({ message: 'Quarter report updated successfully', report: { quarter, year, title, size } });
        } else {
            // Create new report
            const newReport = await QuarterReport.create({
                quarter,
                year,
                title,
                size,
                pdfData: pdfBuffer
            });
            return res.status(201).json({ message: 'Quarter report uploaded successfully', report: { quarter, year, title, size } });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all quarter reports (metadata only, not PDF data)
export const getAllQuarterReports = async (req, res) => {
    try {
        const reports = await QuarterReport.find({}, 'quarter year title size uploadedAt').sort({ year: -1, quarter: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific quarter report PDF
export const getQuarterReportPDF = async (req, res) => {
    try {
        const { quarter } = req.params;

        if (!quarter || !['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            return res.status(400).json({ error: 'Invalid quarter. Must be Q1, Q2, Q3, or Q4.' });
        }

        const report = await QuarterReport.findOne({ quarter });

        if (!report) {
            return res.status(404).json({ error: 'Quarter report not found' });
        }

        // Set headers for PDF download/viewing
        res.setHeader('Content-Type', report.contentType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${report.quarter}_FY${report.year}.pdf"`);
        res.setHeader('Content-Length', report.pdfData.length);

        // Send PDF buffer
        res.send(report.pdfData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a quarter report
export const deleteQuarterReport = async (req, res) => {
    try {
        const { quarter } = req.params;

        const report = await QuarterReport.findOneAndDelete({ quarter });

        if (!report) {
            return res.status(404).json({ error: 'Quarter report not found' });
        }

        res.status(200).json({ message: 'Quarter report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
