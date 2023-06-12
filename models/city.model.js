const mongoose=require('mongoose')
const userCities=mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,require:true},
    precity:{type:String,require:true},
    searches:[{type:String,required:true}]
})
const citiesList=mongoose.model('cities',userCities)
module.exports={citiesList}