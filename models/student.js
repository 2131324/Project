const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
{
    rollno:{
        type:Number,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    fname:{
        type:String,
        required:true,
        trim:true
    },
    class:{
        type:String,
        required:true,
        trim:true
    }
}
)
module.exports = mongoose.model('Student',studentSchema)
