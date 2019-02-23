const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const regData = require('../../models/userRegData');
const key = require('../../setup/myUrl');

router.get('/register',(req,res)=>{
    //res.send("Get route for registration");
    res.render('registration');
})



router.post('/register',(req,res)=>{
    const fname = req.body.fname;
    const uname = req.body.uname;
    const email = req.body.email;
    const passwordNoHash = req.body.password;

     regData.findOne({email:email})
     .then(pdata => {
         if(pdata){
             return res.status(400).json({error:'already registered'})
         }
         else{
    
             const dta = new regData({
                name:fname,
                username:uname,
                email:email,
                password:passwordNoHash
             });
                  // encryption
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(dta.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err) throw err;
                    dta.password=hash;
                    dta.save()
                    .then(dta => res.json(dta))
                    .catch(err => console.log(err))
                });
            });
         }
     })
     .catch(err => res.json({err}))
    })

  

router.post('/login',(req,res)=>{
   // res.send("Post route for login");
   const email = req.body.email;
   const password = req.body.password;

   regData.findOne({email})
   .then(dta => {
       if(!dta){
        return res.status(404).json({emailerror:'User not found'});
       }
      
        bcrypt.compare(password,dta.password)
        .then(isCorrect => {
           if(isCorrect) {
              // res.json({success:'user is able to login'})
             // use payload and create token for user
             const payload = {
                 id: dta.id,
                 email:dta.email
             };
  
             jsonwt.sign(
                payload,
                key.secret,
                {
                    expiresIn:3600
                }
                ,(err, token) => {
                //res.json({token});
                /* res.json({
                    token: token
                }) */
                    res.redirect(`/users/profile?token=${token}`);
                  //res.redirect('/api/auth/profile');
                }
            )
            }
            else{
                res.json({passError:'incorrect password'})
            }
   })
   .catch(err => console.log(err))
   
})

})

// private route for profile
/* router.get('/profile',passport.authenticate('jwt', { session: false }),
(req,res) => {

res.json({
    id: req.user.id,
    name:req.user.name,
    email:req.user.email,
   
})
//console.log(k);
}
); */







module.exports = router;
