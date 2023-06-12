const {user}=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {redisClient}=require('../redis/redis')
const {auth}=require('../mw/auth')
const {Router}=require('express')

const userRouter=Router()

userRouter.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        const isPresent=await user.findOne({email})
        if(!isPresent){
            return res.send('User not present, Register please!!!')
        }
        const pass=await bcrypt.compareSync(password,isPresent.password)
        if(!pass){
            return res.send('Invalid Credentials')
        }
        const token=await jwt.sign({userId:isPresent._id},process.env.JWT_SecretKey,{expiresIn:'1h'})
        res.send({msg:'Login Successful',token})
    }catch(err){
        res.send(err.message)
    }
})
userRouter.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const isPresent=await user.findOne({email})
        if(isPresent){
            return res,send('User already Present')
        }
        const hash=await bcrypt.hashSync(password,5)
        const User=new user({name,email,password:hash})
        await User.save()
        res.send('Registration done successfully')
    }catch(err){
        res.send(err.message)
    }
})
userRouter.post('/logout',auth,async(req,res)=>{
    try{
        const token=req?.headers?.authorization?.split(" ")[1]
        if(!token){
            return res.send('token missing or unexpected error')
        }
        await redisClient.set(req.body.userId,token,{EX:30})
        res.send('Logout successful')
    }catch(err){
        res.send(err.message)
    }
})

module.exports={userRouter}


