const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt =require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose');
const regdta = mongoose.model("regData");
const myKey = require('../setup/myUrl');
const express = require('express');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
opts.secretOrKey = myKey.secret;
console.log(opts.jwtFromRequest);



module.exports = passport => {
    passport.use(new JwtStrategy (opts,(jwt_payload, done) => {
    regdta.findById(jwt_payload.id)
.then(dta =>{
    if(dta) {
        return done(null,dta);
    }
    return done(null, false);
})
.catch(err => console.log(err))
    }));
}
