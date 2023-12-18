const express = require('express');
const router = express.Router();
const Question = require('../models/questions');
const ExamResult = require('../models/exam-results');

router.post('/exam-results', async (req, res) => {
    try {
        const { exam_id, candidate_email } = req.body;
        candidate_questions = [];
        // Fetch all questions from the questions collection
        const questions = await Question.find();

        for (let question of questions) {
            candidate_questions.push({
                question: question.question_text,
                question_ans: question.correct_answer,
                answer_given: '',
                status: 'not answered'
            });
        }
        // Create a document in the exam-results collection
        const examResult = new ExamResult({
            exam_id,
            candidate_email,
            candidate_questions,
            exam_status: 'pending', // Set the initial exam status
            start_time: new Date(), // Set the start time
            completion_time: null, // Set the completion time as null initially
            score: 0, // Set the initial score as 0
        });

        await examResult.save();

        res.status(201).json({ message: 'Exam result created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create exam result' });
    }
});

module.exports = router;
