import { RequestHandler } from "express";

export type AsyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

export default function catchAsync(fn: AsyncRequestHandler): RequestHandler {
  return (...[req, res, next]: Parameters<RequestHandler>) =>
    fn(req, res, next).catch(next);
}
