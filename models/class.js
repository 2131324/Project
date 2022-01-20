const mongoose = require('mongoose')

const classSchema = new mongoose.Schema(
{
    class:{
        type:String,
        required:true,
        trim:true
    }
}
)
module.exports = mongoose.model('Class',classSchema)
