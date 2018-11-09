var JwtStrategy = require('passport-jwt').Strategy;
 
// load up the user model
var User = require('./User');
var config = require('../config/database'); // get db config file
var config = {secret : 'idkman'}
    const opts = {};
  opts.secretOrKey = config.secret;
 
module.exports = passport => {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne(jwt_payload.id, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};