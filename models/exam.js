const mongoose = require('mongoose');
const destinationExamSchema = new mongoose.Schema({
        institute_id: String,
        exam_id: String,
        exam_name: String,
        owner: String,
        collaborators: [String],
        exam_type: String,
        is_active: Boolean,
        negativeMarking: Boolean,
        negativeMarksValue: Number,
        duration: Number,
        activePeriod: {
            startDate: Date,
            endDate: Date
        },
        total_marks: Number
  });

  const Exam = mongoose.model('Exam', destinationExamSchema);

  module.exports = Exam
