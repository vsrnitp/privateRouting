const express = require('express');
const auth = require('./routes/api/auth');
const profile = require('./routes/users/profile');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
app.use(express.static('public'));
app.use(express.static(__dirname + '/resources'));
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//passport midlleware
app.use(passport.initialize());

// config for jwt strategy
require('./strategies/jsonwtStrategies')(passport);


// Connect to MongoDB
mongoose.connect('mongodb://****<username>****:****<password>****@ds155823.mlab.com:55823/worshiapp', {useNewUrlParser: true});
mongoose.connection.once('open', function(){
  console.log('Conection has been made!');
}).on('error', function(error){
    console.log('Error is: ', error);
});




app.get('/',(req,res)=>{
    res.render('index');
})

app.use('/api/auth',auth);
app.use('/users',  passport.authenticate('jwt', { session : false }), profile );

app.listen(8080,console.log('App working fine'));
