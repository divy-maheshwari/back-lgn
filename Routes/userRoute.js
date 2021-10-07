const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const getToken = require('../config/jwt').getToken;
const { isAuth } = require('../config/jwt');


router.post("/register", (req, res) => {
    const { name,email,password } = req.body;
    User.findOne({ email }, (err, registeredUser) => {
      if (registeredUser) {
        res.json({ msg: "user already registered" });
      } else {
        const user = new User(req.body);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err
              else {
              user.password = hash;
              const token = getToken(user);
              user.save()
                       .then((userData) => res.json({userData,token,msg:"new user Created"}))
                       .catch(err => res.json(err));
            }
          });
        });
      }
    });
  });


router.post('/signIn',(req,res) => {    
    User.findOne({email:req.body.email},(err,userData) => {
        if(userData) {
            bcrypt.compare(req.body.password,userData.password,(err,ans) => {
                if(ans === true){
                    const token = getToken(userData);
                    res.json({userData,token,msg:"valid password"});
                }
                else res.json({msg:"invalid password"});
            });
        }
        else res.json({msg:err});
    });
}); 

router.get('/home',isAuth,(req,res) => {
 // console.log(req.body);
  res.json(req.body);
});
module.exports = router;