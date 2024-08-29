import mongoose from 'mongoose';

const TemporaryUserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
});

const TemporaryUser = mongoose.model('TemporaryUser', TemporaryUserSchema);

export default TemporaryUser;
