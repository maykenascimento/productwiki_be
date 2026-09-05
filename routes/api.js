var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');

router.get('/health', function (req, res) {
  var states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  var state = mongoose.connection.readyState;
  var healthy = state === 1;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? 'ok' : 'degraded',
    database: states[state] || 'unknown',
    uptime: Math.floor(process.uptime())
  });
});

router.post('/signup', async function (req, res, next) {
  var username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  var password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please pass username and password.'
    });
  }

  try {
    await User.create({
      username: username,
      password: password
    });

    return res.status(201).json({
      success: true,
      msg: 'Successfully created new user.'
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        msg: 'Username already exists.'
      });
    }

    return next(err);
  }
});

router.post('/signin', async function (req, res, next) {
  var username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  var password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please pass username and password.'
    });
  }

  try {
    var user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'Authentication failed.'
      });
    }

    var isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Authentication failed.'
      });
    }

    var token = jwt.sign(
      {
        sub: user._id.toString(),
        username: user.username
      },
      config.secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token: 'JWT ' + token,
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: 604800
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/signout', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.json({
    success: true,
    msg: 'Signed out. Remove the JWT from the client to complete sign out.'
  });
});

router.post('/product', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    var productData = {
      id: req.body.id,
      codigo: req.body.codigo,
      name: req.body.name,
      description: req.body.description
    };

    if (typeof req.body.published !== 'undefined') {
      productData.published = req.body.published;
    }

    var product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      msg: 'Successfully created new product.',
      product: product
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        msg: err.message
      });
    }

    return next(err);
  }
});

router.get('/product', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    var products = await Product.find().lean();
    return res.json(products);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
