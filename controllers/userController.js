const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const createResponse = (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'Success',
    data: {
      user,
    },
  });
};

exports.getUserInfo = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  createResponse(user, 200, res);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  createResponse(user, 200, res);
});
