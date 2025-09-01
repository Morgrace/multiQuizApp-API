import { Model, Document, PopulateOptions } from "mongoose";
import catchAsync from "./catchAsync";
import AppError from "./appError";
import { APIFeatures } from "./apiFeatures";
import { IAuthenticatedRequest } from "../controllers/authController";
import MultiOption, { IMultiOption } from "../models/multiOptionModel";

function isMultiOption(doc: Document): doc is IMultiOption {
  return "createdByUser" in doc;
}

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: IAuthenticatedRequest, res, next) => {
    const query = Model.findByIdAndDelete(req.params.id);

    if (req.user?.role === "admin") {
      query.setOptions({ includeInactive: true });
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: IAuthenticatedRequest, res, next) => {
    const query = Model.findById(req.params.id);

    if (req.user?.role === "admin") {
      query.select("+active +closedAccount -__v");
      query.setOptions({ includeInactive: true });
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError("Use /updateMyPassword to update password", 400)
      );
    }

    if (
      isMultiOption(doc) &&
      !doc.createdByUser(req.user?._id?.toString() || "", req.user?.role || "")
    ) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    Object.assign(doc, req.body);
    await doc.save();
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: IAuthenticatedRequest, res, next) => {
    const isArray = Array.isArray(req.body);

    if (isArray && Model.modelName === "MultiOption") {
      // Handle array of objects
      const documentsToCreate = req.body.map((item: unknown) => ({
        ...(item as Record<string, unknown>),
        createdBy: req.user?._id,
      }));

      const docs = await Model.create(documentsToCreate);

      res.status(201).json({
        status: "success",
        results: Array.isArray(docs) && docs.length,
        data: {
          data: docs,
        },
      });
    } else {
      // Handle single object (original behavior)
      const doc = await Model.create({ ...req.body, createdBy: req.user?._id });

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }
  });

export const getOne = <T extends Document>(
  Model: Model<T>,
  popOptions?: PopulateOptions
) =>
  catchAsync(async (req: IAuthenticatedRequest, res, next) => {
    const { category, id } = req.params;

    const filter: { category?: string; _id?: string } = {};

    if (category) filter.category = category;
    if (id) filter._id = id;

    let query = Model.findOne(filter);

    if (popOptions) query = query.populate(popOptions);

    if (req.user?.role === "admin") {
      query.select("+active +closedAccount -__v");
      query.setOptions({ includeInactive: true });
    }

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(
          `No document found with that ID  ${category ? "in category" : ""}`,
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: IAuthenticatedRequest, res, next) => {
    //Build filter object
    let filter = {};
    const isAdmin = req.user?.role === "admin";

    if (req.params.category) {
      filter = { category: req.params.category };
    }

    //Build base query
    const query = Model.find(filter);

    if (isAdmin) {
      query.select("+active +closedAccount");
      query.setOptions({ includeInactive: true });
    }

    const features = new APIFeatures(query, req?.query)
      .applyFilter()
      .applySort()
      .applyFieldLimiting()
      .applyPagination();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
