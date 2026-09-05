var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('../config/database');

module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromAuthHeaderWithScheme('jwt')
    ]),
    secretOrKey: config.secret
  };

  passport.use(new JwtStrategy(opts, async function (jwtPayload, done) {
    try {
      var userId = jwtPayload.sub || jwtPayload._id || jwtPayload.id;

      if (!userId) {
        return done(null, false);
      }

      var user = await User.findById(userId);
      return done(null, user || false);
    } catch (err) {
      return done(err, false);
    }
  }));
};
