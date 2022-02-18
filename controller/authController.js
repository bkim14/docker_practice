const User=require('../model/userModel');
const bcrypt=require('bcryptjs');

exports.signUp = async(req,res)=>{
  const {username,password}=req.body;
  const hashPassword=await bcrypt.hash(password,12);
  try{
    const newUser=await User.create({
      username,
      password:hashPassword,
    });
    res.status(201).json({
      status:'success',
      data:{
        user:newUser,
      }
    })
  }catch (e){
    console.log(e);
    res.status(400).json({
      status:'fail',
    })
  }
}

exports.logIn = async(req,res)=>{
  const {username,password}=req.body;
  try{
    const user=await User.findOne({username});
    if(!user){
      return res.status(404).json({
        status:'fail',
        message:'user not found'
      })
    }
    const isCorrect = await bcrypt.compare(password,user.password)
    console.log(isCorrect);
    if(isCorrect){
      console.log('xxx');
      res.status(200).json({
        status:'success'
      });
      console.log('ttttt');
    }else{
      res.status(400).json({
        status:'fail',
        message:'incorrect username or password'
      })
    }
  }catch (e) {
    res.status(400).json({
      status:'failxx'
    })
  }
}

exports.getAllUsers=async(req,res)=>{
  try{
    const users=await User.find();
    res.status(200).json({
      status:'success',
      results:users.length,
      data:{users}
    })
  }catch (e) {
    res.status(400).json({
      status:'fail'
    })
  }
}
