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

const DestinationCandidate = require('../models/candidate')

router.get('/allUsers', async (req, res) => {
    try {
        const users = await DestinationCandidate.find({});
        return res.status(200).send(users);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send({ message: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
        console.log("req.body",req.body)
        const { exam_id, email, otp } = req.body;

        console.log("exam_id",exam_id)
        console.log("email",email)
        console.log("otp",otp)

        if (!exam_id || !email || !otp) {
          return res.status(400).send({ message: 'Both exam_id and otp are required.' });
        }

        const user = await DestinationCandidate.findOne({ exam_id:exam_id , email, otp});
        console.log(user)
        if (!user) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }

        const isEmailValid = email === user.email;
        if (!isEmailValid) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }

        req.session.email = user.email;
        // If login is successful, send a success response. You can also generate a token or set a session here.
        return res.status(200).send({ message: 'Login successful.', user: user });

      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Server error' });
      }
  });

  router.get('/current-user', async(req, res) => {
    try {
      console.log('session', req.session.userId)
      if (req.session.email) {
        // Assuming you have a method to find a user by ID
        const user = await DestinationCandidate.findOne({user_id: req.session.userId})
        res.json({ user: user });
      } else {
        res.status(401).send('No active session');
      }
    } catch(error) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  module.exports = router
