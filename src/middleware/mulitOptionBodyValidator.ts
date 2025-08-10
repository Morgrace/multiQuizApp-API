import { NextFunction, Request, Response } from "express";
import { IMultiOption } from "../models/multiOptionModel";
import AppError from "../utils/appError";

export const multiOptionBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      next();
    },
    isObject() {
      if (req.body?.category && req.body?.category !== routeCategory)
        return next(
          new AppError(
            `Category mismatch: URL specifies '${routeCategory}' but body contains question with category '${req.body.category}'`,
            400
          )
        );
      next();
    },
  };

  bodyValidation[isArray ? "isArray" : "isObject"]();
};
