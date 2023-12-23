const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    candidate_email: String,
    exam_id: String,
    candidate_questions: [{
        question_id: String,
        question_ans: String,
        answer_given: String,
        status: String,
        question_marks: Number
    }],
    exam_status: String,
    start_time: Date,
    completion_time: Date,
    score: Number
});

const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = ExamResult;
