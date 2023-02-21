const express = require("express");
const User = require("../models/User.js");
const router = express.Router();
var jwt = require("jsonwebtoken");
let FetchUser=require('../middleware/FetchUser')
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const JWT_SECRET = "Iliketodomernstackdeveloping";

//Create a User using: POST "/api/auth/createuser".Doesnt require Auth
router.post(
  "/createuser",
  [
    body("email", "Email is not valid").isEmail(),
    body("name", "Name should be greater than 3").isLength({ min: 3 }),
    body("password", "Password should be greater than 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email exist" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" Error occured");
    }
  }
);
router.post(
  "/login",
  [
    body("email", "Email is not valid").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{email,password}=req.body;
    try{
      let user=await User.findOne({email});
      if(!user){
        
        return res.status(400).json({error:"Invalid Credentials"})

      }
      const passcompare=await bcrypt.compare(password,user.password);
      if(!passcompare){
        success=false
        return res.status(400).json({success,error:"Invalid Credentials"})

      }
      const payload={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(payload,JWT_SECRET)
      success=true;
      res.json({success,authtoken})
    }catch(error){
      console.error(error.message);
      res.status(500).send(" Internal Server Error occured");
    }
  }
);
router.post('/getUser',FetchUser,async(req,res)=>{
  try{
    userId=req.user.id;
    const user=await User.findById(userId).select("-password")
    res.send(user)
  }catch(error){
    console.error(error.message);
    res.status(500).send(" Internal Server Error occured");
  }
})
module.exports = router;
