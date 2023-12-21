const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

const Question = require('../models/questions');
const ExamResult = require('../models/exam-results');

router.post('/insertCandidate', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const { exam_id, candidate_email } = req.body;
        candidate_questions = [];
        // Fetch all questions from the questions collection
        const questions = await Question.find({exam_id:exam_id});

        for (let question of questions) {
            candidate_questions.push({
                question: question.question_text,
                question_ans: question.correct_answer,
                answer_given: '',
                status: 'not answered'
            });
        }
        // Create a document in the exam-results collection
        console.log('date now', Date.now())
        const examResult = new ExamResult({
            exam_id,
            candidate_email,
            candidate_questions,
            exam_status: 'pending', // Set the initial exam status
            start_time: Date.now(), // Set the start time
            completion_time: null, // Set the completion time as null initially
            score: 0, // Set the initial score as 0
        });

        await examResult.save();

        res.status(200).json({ startTime: Date.now(), message: 'Exam result created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create exam result' });
    }
});

router.get('/fetchall', async (req, res) => {
    try {
        const examResults = await ExamResult.find();
        res.status(200).json(examResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch exam results' });
    }
});


module.exports = router;
