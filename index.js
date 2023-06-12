const express=require('express')

const {connection}=require('./config/db')
const {userRouter}=require('./routes/user.routes')
const {redisClient}=require('./redis/redis')
const {auth}=require('./mw/auth')
const {cityRouter}=require('./routes/city.routes')
const logger=require('./mw/logger')
require('dotenv').config()

const app=express()
const port=process.env.PORT||8080

let loggerTouse=(req,res,next)=>{
    logger.log('info',`A ${req.method} request is made on url: ${req.url}`)
    next()
}
app.use(loggerTouse)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Working fine!!!')
})
app.use('/user',userRouter)
app.use(auth)
app.use('/weather',cityRouter)

app.listen(port,async()=>{
    try{
        await connection
        console.log(`listening to port ${port}`)
    }catch(err){
        console.log(err.message)
    }
})