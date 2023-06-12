const cityValid=(req,res,next)=>{
    const cityname=req.params.city
    let regex=/^[a-zA-Z\s]$/
    if(regex.test(cityname)){
        next()
    }else{
        return res.send('Please provide valid city name!!!')
    }
}
module.exports={cityValid}