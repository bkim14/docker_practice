const express=require('express')
const authController=require('../controller/authController');

const router=express.Router();

router.post("/signup",authController.signUp);
router.post("/login", authController.logIn);
router.get("/",authController.getAllUsers);

module.exports=router;
