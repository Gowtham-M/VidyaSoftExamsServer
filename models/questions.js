const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    exam_id: String,
    topic_name: String,
    subtopic_name: String,
    question_id: String,
    question_text: String,
    question_type: String,
    options: [String],
    correct_answer: String,
    difficulty_level: String,
    marks: Number,
    tags: [String]
})

module.exports = mongoose.model('Question', questionSchema)
