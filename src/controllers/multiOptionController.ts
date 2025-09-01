import MultiOption from "../models/multiOptionModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../utils/handlerFactory.js";

export const getAllQuestions = getAll(MultiOption);

export const getQuestion = getOne(MultiOption, { path: "createdBy" });

export const createQuestion = createOne(MultiOption);

export const updateQuestion = updateOne(MultiOption);

export const deleteQuestion = deleteOne(MultiOption);
