import { Request } from "express";
import MultiOption from "../models/multiOptionModel";
type ParsedQs = Request["query"];

export class APIFeatures {
  constructor(
    public query = MultiOption.find(),
    private queryString: ParsedQs
  ) {}
  applyFilter() {
    const queryObj = { ...this.queryString };
    //remove all other formatting paramters and leaving only filter criteria
    ["page", "sort", "limit", "fields"].forEach((el) => delete queryObj[el]);

    // converts URL-friendly operators to MongoDb operators;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt}lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  applySort() {
    if (this.queryString.sort && typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("questions");
    }
    return this;
  }
  applyFieldLimiting() {
    if (
      this.queryString.fields &&
      typeof this.queryString.fields === "string"
    ) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields) as typeof this.query;
    } else {
      this.query = this.query.select("-__v") as typeof this.query;
    }
    return this;
  }
  applyPagination() {
    const page = Number(this.queryString?.page) || 1;
    const limit = Number(this.queryString?.limit) || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
