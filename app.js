const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();

app.use(session({
    secret: 'vidya_soft_secret_key', // A secret key for signing the session ID cookie
    resave: false, // Don't save the session if unmodified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
      httpOnly: true, // Makes the cookie inaccessible to client-side scripts, enhancing security
      maxAge: 1000 * 60 * 60 * 24 // Sets cookie expiration to one day
    }
  }));

  app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: 'http://localhost:8080' }));

  const userRoutes = require('./routes/login');
  const examRoutes = require('./routes/exam');

  app.use('/users', userRoutes);
  app.use('/exam', examRoutes);

  const port = 5000;

// Middleware to parse incoming form data

// Connect to your MongoDB Atlas cluster

const mongoURI2 = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/exam_platform';

let connection1;

async function connectToDatabase() {
  try {
    connection1 = await mongoose.connect(mongoURI2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');
    return { connection1 };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
  });
