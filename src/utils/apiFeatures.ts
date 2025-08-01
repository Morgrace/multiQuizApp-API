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
}
