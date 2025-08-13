import catchAsync from "../utils/catchAsync";

export const getUsers = catchAsync(async function (req, res, next) {
  res.status(200).json({
    status: "success",
    data: "nothing here yet",
  });
});
