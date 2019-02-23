const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose');
const regdta = mongoose.model("regData");
const myKey = require('../setup/myUrl');
const request = require('request');
const cookieParser = require('cookie-parser'); 
//opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');


const cookieExtractor = function (req, res, next) {
    console.log('req', req.headers.cookie.split(';'));
    const tokenArr = req.headers.cookie.split(';');
    const tokenJWT = tokenArr[tokenArr.length-1];
    const tokenI = tokenJWT.split('=');
    const token = tokenI[tokenI.length-1];
    console.log(tokenJWT);
    console.log("Here", token);
    /* if (req && req.cookies) {
      token = req.cookies['jwt'];
      console.log(token);
    } */
    return token;
  };
module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = myKey.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    regdta.findById(jwt_payload.id)
      .then(dta => {
        if (dta) {
          return done(null, dta);
        }
        return done(null, false);
      })
      .catch(err => console.log(err))
  }));
}
