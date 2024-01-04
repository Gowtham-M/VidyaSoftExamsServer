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

const Question = require('../models/questions')

router.get('/exam-questions', async(req, res) => {
    try {
        const exam_id = req.query.exam_id;
        console.log('exam id', exam_id)
        const examQuestions = await Question.find({ exam_id })
        res.json(examQuestions)
    } catch(error) {
        res.status(500).send({ message: 'Server error' });
    }
});


// Route to get questions grouped by topic for a specific exam
router.get('/exam-questions-by-topic', async (req, res) => {
    const examId = req.query.exam_id;

    try {
        const aggregatedQuestions = await Question.aggregate([
            {
                $match: { exam_id: examId } // Filter the questions by exam_id first
            },
            {
                $group: {
                    _id: "$topic_name", // Group by the topic name
                    questions: {
                        $push: { // For each group, create an array of questions
                            question_text: "$question_text",
                            options: "$options",
                            // Include any other question fields you need here
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, // Suppress the _id field
                    topic_name: "$_id", // Rename the _id field to topic_name
                    questions: 1 // Include the questions array
                }
            }
        ]);

        // Send the response back
        res.json(aggregatedQuestions);
    } catch (error) {
        console.error('Error fetching questions grouped by topic:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router
