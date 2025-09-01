import mongoose, { Document } from "mongoose";

export interface IMultiOption extends Document {
  category: "general" | "math" | "nature" | "sports";
  question: string;
  options: string[];
  answer: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  createdByUser(candidateId: string, candidateRole: string): boolean;
}

const multiOptionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "A quiz must a category"],
      enum: {
        values: ["general", "math", "nature", "sports"],
        message:
          "Category must be either 'general','math','nature' or 'sports'",
      },
      index: true,
    },
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
      required: [true, "A quiz must have options"],
      validate: {
        validator: function (options: string[]) {
          return Array.isArray(options) && options.length === 4;
        },
        message: "Exactly 4 options must be specified",
      },
    },
    answer: {
      type: String,
      required: [true, "A quiz must have an answer"],
      validate: {
        validator: function (this: IMultiOption, value: string) {
          return Array.isArray(this.options) && this.options.includes(value);
        },
        message: "({VALUE}) is invalid: Answer must be one of the options",
      },
    },
    createdAt: { type: Date, default: Date.now },
    //referencing User
    createdBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Question must belong to a user"],
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

multiOptionSchema.methods.createdByUser = function (
  this: IMultiOption,
  candidateId: string,
  candidateRole: string
) {
  return this.createdBy.toString() === candidateId || candidateRole === "admin";
};

const MultiOption = mongoose.model<IMultiOption>(
  "MultiOption",
  multiOptionSchema
);

export default MultiOption;
