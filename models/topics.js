const mongoose = require('mongoose');

const subTopicsSchema = new mongoose.Schema({
        subtopic_name: String
  })
const topicSchema = new mongoose.Schema({
        exam_id: String,
        topic_name: String,
        description: String,
        marks: Number,
        no_of_questions: Number,
        sub_topics: [subTopicsSchema]
  });

  const Topic = mongoose.model('Topic', topicSchema);

  module.exports = Topic
