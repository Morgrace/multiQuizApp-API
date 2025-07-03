import MultiOption from "../models/multiOptionModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllQuestions = catchAsync(async function (req, res, next) {
  const questions = await MultiOption.find();

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: questions,
  });
});

export const getAllQuestionByCatergory = catchAsync(async function (
  req,
  res,
  next
) {
  const { category } = req.params;
  const questions = await MultiOption.find({ category });

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: questions,
  });
});

export const getQuestion = catchAsync(async function (req, res, next) {
  const question = await MultiOption.findById(req.params.id);

  if (!question)
    return next(new AppError("No questions found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: question,
  });
});

export const createQuestion = catchAsync(async function (req, res, next) {
  const newQuestion = await MultiOption.create(req.body);

  res.status(201).json({
    status: "success",
    data: newQuestion,
  });
});

export const updateQuestion = catchAsync(async function (req, res, next) {
  const question = await MultiOption.findById(req.params.id);

  if (!question) {
    return next(new AppError("No question with that ID", 404));
  }

  Object.assign(question, req.body);
  await question.save();
  res.status(200).json({
    status: "success",
    data: question,
  });
});
export const deleteQuestion = catchAsync(async function (req, res, next) {
  const question = await MultiOption.findByIdAndDelete(req.params.id);

  if (!question)
    return next(new AppError("Invalid ID: no question found", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
