const mongoose = require('mongoose');
const Schema = mongoose.Schema;

assessmentExamSchema = mongoose.createConnection('mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/assesment_platform');

const questionSchema = new mongoose.Schema({
    institute_id: String,
    topic_name: String,
    subtopic_name: String,
    question_id: String,
    question_text: String,
    question_type: String,
    options: [String],
    correct_answer: String,
    difficulty_level: String,
    marks: Number
});

const subTopicSchema = new mongoose.Schema({
    subtopic_name: String,
    subtopic_description: String,
    questions: [questionSchema]
});

const topicSchema = new mongoose.Schema({
    institute_id: String,
    topic_name: String,
    description: String,
    marks: Number,
    no_of_questions: Number,
    sub_topics: [subTopicSchema]
});

const inviteeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    examKey: String,
    invitation: String,
    status: String,
    marksScored: Number,
    timeSpent: Number
});

const examSchema = new mongoose.Schema({
    institute_id: String,
    exam_id: String,
    exam_name: String,
    owner: String,
    collaborators: [String],
    exam_type: String,
    is_active: Boolean,
    topics: [topicSchema],
    negativeMarking: Boolean,
    negativeMarksValue: Number,
    totalMarks: Number,
    duration: Number,
    activePeriod: {
        startDate: Date,
        endDate: Date
    },
    invitees: [inviteeSchema]
});

const Exam = assessmentExamSchema.model('exams', examSchema);

module.exports = Exam;
