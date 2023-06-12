const {Router}=require('express')
const cityRouter=Router()
const redisClient=require('../redis/redis')
const {citiesList}=require('../models/city.model')
const axios=require('axios')
require('dotenv').config()
const API_KEY=process.env.API_KEY
const cityValid=require('../mw/cityValid')
const apilimit=require('../mw/limiter')
const logger=require('../mw/logger')

cityRouter.get(':/city',cityValid,apilimit,async(req,res)=>{
    try{
        const city=req.params.city
        const isIncache=await redisClient.get(city)
        if(isIncache){
            return res.send(isIncache)
        }
        const response=await axios.get(`http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${API_key}&q=${city}`)
        const data=response.data
        await redisClient.set(city,JSON.stringify(data),{EX:30*60})
        await citiesList.findOneAndUpdate({userId:req.body.userId},{userId:req.body.userId,precity:city,$push:{searches:city}},{upsert:true,new:true,setDefaultsOnInsert:true})
        res.send({weatherdata:data})
    }catch(err){
        res.send(err.message)
    }
})

module.exports={cityRouter}