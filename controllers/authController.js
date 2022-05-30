const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const createSignToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  res.status(statusCode).json({
    data: {
      status: 'Success',
      token,
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
  });

  createSignToken(newUser, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect password or Email'));
  }
  const token = signToken(user.id);
  res.status(200).json({
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Checking if the token exists on the headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = await req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You not logged In!', 400));
  }
  // 2) Verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The User belonging to this token nolonger exists', 400)
    );
  }

  req.user = currentUser;
  next();
});
