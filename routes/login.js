const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const shortid = require('shortid');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:6000', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

const DestinationCandidate = require('../models/candidate')

router.post('/login', async (req, res) => {
    try {
        const { exam_id, email, otp } = req.body;
  
        if (!exam_id || !email || !otp) {
          return res.status(400).send({ message: 'Both exam_id and otp are required.' });
        }
  
        const user = await DestinationCandidate.findOne({ exam_id:exam_id , email, otp});
        if (!user) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }
  
        const isEmailValid = email === user.email;
        if (!isEmailValid) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }
  
        req.session.exam_id = user.exam_id;
        // If login is successful, send a success response. You can also generate a token or set a session here.
        return res.status(200).send({ message: 'Login successful.', user: user });
  
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Server error' });
      }
  });

  module.exports = router