import mongoose from "mongoose";

const trueFalseQuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: [true, "A quiz must have a question"],
    minlength: [10, "A quiz must be at least 10 characters"],
    maxlength: [300, "A quiz must not be more than 300 characters"],
    trim: true,
    unique: true,
  },
  options: {
    type: [String],
    maxlength: [2, "Options must be exactly 2"],
    minlength: [2, "Options must be exactly 2"],
    required: [true, "A quiz must have options"],
    validate: {
      validator: function (value) {
        const eitherTrueOrFalse = (value) =>
          value.toLowerCase() === "true" || value.toLowerCase() === "false";

        return Array.isArray(value) && value.every(eitherTrueOrFalse);
      },
      message: "Options must be exactly ['true', 'false']",
    },
  },
  answer: {
    type: String,
    required: [true, "A quiz must have an answer"],
    trim: true,
    enum: {
      values: ["true", "false"],
      message: "Answer is either: true or false",
    },
  },
});
const TrueFalseQuestion = mongoose.model(
  "TrueFalseQuestion",
  trueFalseQuestionSchema
);
export default TrueFalseQuestion;
