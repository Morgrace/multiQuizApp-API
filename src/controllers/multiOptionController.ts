import { NextFunction, Request, Response } from "express";
import MultiOption, { IMultiOption } from "../models/multiOptionModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { APIFeatures } from "../utils/apiFeatures.js";

export const getAllQuestions = catchAsync(async function (
  req: Request,
  res: Response
) {
  const query = req.query;

  const features = new APIFeatures(MultiOption.find(), query).applyFilter();

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
  const questions = await MultiOption.find({ category });

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
  const isArray = Array.isArray(req.body);
  const routeCategory = req.params.category;

  const bodyValidation = {
    isArray() {
      const invalidQuestion = req.body.find(
        (question: IMultiOption) =>
          question.category && question.category !== routeCategory
      );
      if (invalidQuestion) {
        return next(
          new AppError(
            `Category mismatch: URL specifies '${routeCategory}' but body contains question with category '${invalidQuestion.category}'`,
            400
          )
        );
      }
    },
    isObject() {
      if (req.body?.category && req.body?.category !== routeCategory)
        return next(
          new AppError(
            `Category mismatch: URL specifies '${routeCategory}' but body contains question with category '${req.body.category}'`,
            400
          )
        );
    },
  };

  bodyValidation[(isArray && "isArray") || "isObject"]();

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
