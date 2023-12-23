const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const nodemailer = require('nodemailer');

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
            console.log("question", question)
            candidate_questions.push({
                question_id: question.question_id,
                question_ans: question.correct_answer,
                answer_given: '',
                status: 'not-answered',
                question_marks: question.marks
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
            score: 0,
            question_score:"" // Set the initial score as 0
        });

        await examResult.save();

        res.status(200).json({ startTime: Date.now(), attemptSummaryPanel: candidate_questions, message: 'Exam result created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create exam result' });
    }
});

router.post('/submit', async (req, res) => {
    try {
      const { candidate_email, exam_id } = req.body;

      console.log('coming here first')

      // Step 1: Mark the exam as submitted (and optionally store answers)
      await markExamAsSubmitted(candidate_email, exam_id);

      // Step 2: End the exam session
      if (req.session) {
        req.session.destroy(err => {
          if (err) {
            return res.status(500).send('Error ending session');
          }
          res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name

          // Step 3: Respond with user's response (before score calculation)
          res.json({ message: 'Exam submitted successfully. Your response has been recorded.' });

          // Step 4: Calculate the score asynchronously (in the background)
          calculateCandidateScore(candidate_email, exam_id)
            .then(score => {
              let transporter = nodemailer.createTransport({
                service: 'gmail', // Example using Gmail. Use your own configurations.
                auth: {
                  user: 'nagasruthikota@gmail.com', // Your email
                  pass: 'ozbu oocd cfpi pvye' // Your password
                }
              });
              let mailOptions = {
                from: 'nagasruthikota@gmail.com',
                to: candidate_email,
                subject: 'Exam Score',
                text: `Your Exam Score is ${score}`
                };


              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Error occurred:', error);
                } else {
                  console.log('Email sent:', info.response);
                }
              });
            })
            .catch(scoreError => {
              console.error('Error calculating score:', scoreError);
            });
        });
      } else {
        res.json({ message: 'Exam submitted successfully' });
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      res.status(500).send('Error submitting exam');
    }
});

  const markExamAsSubmitted = async (candidateId, examId) => {

    const completeTime = Date.now();
    const examStatus = 'submitted';
    await ExamResult.updateOne(
      { candidate_email: candidateId, exam_id: examId },
      { $set: { completion_time: completeTime, exam_status: examStatus } }
    );
  };

  async function calculateCandidateScore(candidate_email, exam_id) {
    try {
      const examResult = await ExamResult.findOne({ exam_id, candidate_email });

      if (!examResult) {
        throw new Error('Exam result not found');
      }

      let score = 0;
      for (let question of examResult.candidate_questions) {
        if (question.question_ans === question.answer_given) {
          score += question.question_marks;
        }
      }

      examResult.score = score;
      await examResult.save();
      console.log('returning score..')
      return score; // Return the calculated score
    } catch (error) {
      throw error; // Rethrow any errors for handling in the calling code
    }
  }

router.get('/fetchAll', async (req, res) => {
    try {
        const examResults = await ExamResult.find();
        res.status(200).json(examResults);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch exam results' });
    }
});

router.delete('/deleteAll', async (req, res) => {
    try {
        const result = await ExamResult.deleteMany();
        res.send({ message: `${result.deletedCount} exam results have been deleted.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete exam results' });
    }
  })

router.post('/updateQuestionStatus', async (req, res) => {
    try {
        const { exam_id, candidate_email, question_id, status, answer_given } = req.body;
        console.log(req.body)

        const result = await ExamResult.findOneAndUpdate(
          { exam_id, candidate_email, "candidate_questions.question_id": question_id },
          {
            $set: {
              "candidate_questions.$.answer_given": answer_given,
              "candidate_questions.$.status": status
            }
          },
          { new: true } // Returns the updated document
        );

        if (result) {
          res.json({ message: 'Question updated successfully', updatedResult: result });
        } else {
          res.status(404).send('Exam result not found');
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update question status' });
    }
});

module.exports = router;
