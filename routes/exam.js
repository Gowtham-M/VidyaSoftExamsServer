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

const Exam = require('../models/exam')
const Topic = require('../models/topics')

router.get('/exam-details', async(req, res) => {
    try {
        const exam_id = req.query.exam_id;
        console.log('exam id', exam_id)
        const exam = await Exam.findOne({ exam_id })
        console.log('exam', exam)
        if (exam) {
            res.json({ success: true, exam });
        } else {
            res.status(404).json({ success: false, message: 'Exam not found' });
        }
    } catch(error) {
        res.status(500).send({ message: 'Server error' });
    }
});

router.get('/exam-topics', async(req, res) => {
    try {
        const exam_id = req.query.exam_id;
        const topics = await Topic.find({ exam_id }); // Fetch all topics
        console.log('topics', topics)
        res.json(topics);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

router.post('/update-exam-details', async(req, res) => {
    try {
        const { candidate_email, exam_id } = req.body;
        await Exam.updateOne(
            { candidate_email: candidate_email, exam_id: exam_id },
            { $set: { duration: 5 } }
          );
    } catch(error) {
        res.status(500).send({ message: 'Server error' });
    }
});

module.exports = router
