import { NextFunction, Request, Response } from "express";
import MultiOption from "../models/multiOptionModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllQuestions = catchAsync(async function (
  req: Request,
  res: Response
) {
  const query = req.query;

  const features = new APIFeatures(MultiOption.find(), query)
    .applyFilter()
    .applySort()
    .applyFieldLimiting()
    .applyPagination();

  const allQuestions = await features.query;

  res.status(200).json({
    status: "success",
    results: allQuestions.length,
    data: allQuestions,
  });
});

export const getAllQuestionByCatergory = catchAsync(async function (
  req: Request,
  res: Response
) {
  const { category } = req.params;

  const features = new APIFeatures(MultiOption.find(), req?.query)
    .applyFilter()
    .applySort()
    .applyFieldLimiting()
    .applyPagination();

  features.query = features.query.find({ category });

  const questions = await features.query;

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: questions,
  });
});

export const getQuestion = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //FIXME scenario where the user gets a question with id but from a wrong category;
  const question = await MultiOption.findById(req.params.id);

  if (!question)
    return next(new AppError("No questions found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: question,
  });
});

export const createQuestion = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  //put the middle wear

  const newQuestion = await MultiOption.create(req.body);

  res.status(201).json({
    status: "success",
    data: newQuestion,
  });
});

export const updateQuestion = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
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

export const deleteQuestion = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const question = await MultiOption.findByIdAndDelete(req.params.id);

  if (!question)
    return next(new AppError("Invalid ID: no question found", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
