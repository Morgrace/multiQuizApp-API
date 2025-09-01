import { Request } from "express";
import { Document, Query } from "mongoose";

type ParsedQs = Request["query"];

export class APIFeatures<T extends Document> {
  constructor(public query: Query<T[], T>, private queryString: ParsedQs) {}

  applyFilter() {
    const queryObj = { ...this.queryString };
    // Remove all other formatting parameters and leaving only filter criteria
    ["page", "sort", "limit", "fields"].forEach((el) => delete queryObj[el]);

    // Converts URL-friendly operators to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  applySort() {
    if (this.queryString.sort && typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Changed from "questions" to more generic
    }
    return this;
  }

  applyFieldLimiting() {
    if (
      this.queryString.fields &&
      typeof this.queryString.fields === "string"
    ) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  applyPagination() {
    const page = Number(this.queryString?.page) || 1;
    const limit = Number(this.queryString?.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
