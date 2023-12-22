const express = require('express');
const router = express.Router();
const Question = require('../models/questions');
const ExamResult = require('../models/exam-results');

router.post('/insertcandidate', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const { exam_id, candidate_email } = req.body;
        candidate_questions = [];
        // Fetch all questions from the questions collection
        const questions = await Question.find({exam_id:exam_id});

        for (let question of questions) {
            console.log("question", question)
            candidate_questions.push({
                question: question.question_text,
                question_ans: question.correct_answer,
                answer_given: '',
                status: 'not answered',
                question_marks: question.marks,
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
            score: 0,
            question_score:"" // Set the initial score as 0
        });

        await examResult.save();

        res.status(201).json({ message: 'Exam result created successfully' });
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

router.put('/updatequestionstatus', async (req, res) => {
    try {
        const { exam_id, candidate_email, questionId, status } = req.body;
        console.log(req.body)

        // Find the exam result document by ID
        const examResult = await ExamResult.findOne({ exam_id: exam_id, candidate_email: candidate_email });

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        // Find the question in the candidate_questions array and update its status
        const question = examResult.candidate_questions.id(questionId);
        if (question) {
            question.status = status;
            await examResult.save();
            res.status(200).json(examResult);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update question status' });
    }
});

router.get('/fetchcandidate', async (req, res) => {
    try {
        const { exam_id, candidate_email } = req.query;

        // Find the exam result document by exam_id and candidate_email
        const examResult = await ExamResult.findOne({ exam_id, candidate_email });

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        let score = 0;

        // Calculate the score by comparing question_answer to answer_given
        for (let question of examResult.candidate_questions) {
            if (question.question_ans === question.answer_given) {
                score += question.question_marks;
            }
        }

        examResult.score = score;
        await examResult.save();

        res.status(200).json(examResult);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch candidate details' });
    }
});




module.exports = router;
