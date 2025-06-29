import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "A quiz must have a question"],
    unique: true,
    maxlength: [300, "A quiz must not be above 300 characters"],
    minlength: [10, "A quiz must have at least 10 characters"],
    trim: true,
  },
  options: {
    type: [String],
    maxlength: [4, "Exactly 4 options must be specified"],
    minlength: [4, "Exactly 4 options must be specified"],
    required: [true, "A quiz must have options"],
  },
  answer: {
    type: String,
    required: [true, "A quiz must have an answer"],
    validate: {
      validator: function (value) {
        return Array.isArray(this.options) && this.options.includes(value);
      },
      message: "Answer must be one of the options",
    },
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
