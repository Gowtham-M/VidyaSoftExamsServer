const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    candidate_email: String,
    exam_id: String,
    candidate_questions: [{
        question: String,
        question_ans: String,
        answer_given: String,
        status: String
    }],
    exam_status: String,
    start_time: Date,
    completion_time: Date,
    score: Number
});

const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = ExamResult;
