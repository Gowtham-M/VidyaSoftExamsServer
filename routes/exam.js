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

router.get('/exam-details', async(req, res) => {
    try {
        const exam_id = req.query.exam_id;
        console.log('exam id', exam_id)
        const exam = await Exam.findOne({ exam_id })
        if (exam) {
            res.json({ success: true, exam });
        } else {
            res.status(404).json({ success: false, message: 'Exam not found' });
        }
    } catch(error) {
        res.status(500).send({ message: 'Server error' });
    }
});

module.exports = router
