const ratelimit=require('express-rate-limit')
const apilimit=ratelimit({
    windowMs:3*60*1000,
    max:1,
    standardHeader:true,
    legacyHeaders:false
})
module.exports={apilimit}