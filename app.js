var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var helmet = require('helmet');
var config = require('./config/database');

mongoose.connect(config.database)
  .then(function () {
    console.log('MongoDB connected');
  })
  .catch(function (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

var api = require('./routes/api');
var app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api', api);

app.use(function (req, res) {
  res.status(404).json({
    success: false,
    msg: 'Not Found'
  });
});

app.use(function (err, req, res, next) {
  var status = err.status || 500;
  var message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'production' && status >= 500) {
    message = 'Internal Server Error';
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    msg: message
  });
});

module.exports = app;
