const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationCandidateSchema = new Schema({
    exam_id: String,
    firstName: String,
    lastName: String,
    email: String,
    otp: String
});

const DestinationCandidate = mongoose.model('Candidate', destinationCandidateSchema);
module.exports = DestinationCandidate