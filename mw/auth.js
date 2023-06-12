const jwt=require('jsonwebtoken')
const {redisClient}=require('../redis/redis')

const auth=async(req,res,next)=>{
    try{
        const token=req?.headers?.authorization?.split(" ")[1]
        if(!token){
            return res.send('Please login!!!')
        }
        const isValid=await jwt.verify(token,process.env.JWT_SecretKey)
        if(isValid){
            return res.send('Authentication failed , please login again')
        }
        const isBlacklisted=await redisClient.get(isvalid.userId)
        if(isBlacklisted){
            return res.send('unauthorised')
        }
        req.body.userId=isValid.userId
        next()
    }catch(err){
        res.send({msg:'Please login',err:err.message})
    }
}
module.exports={auth}