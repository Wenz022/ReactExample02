const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        uniqu:1
    },
    password:{
        type:String,
        maxlength:50
    },
    role: {
        type:Number,
        default: 0
    },
    image:String,
    token:{
        type:Number
    },
    tokenExp:{
        type:Number
    }
})

const User = mongoose.model('User', userSchema)

module.export = {User}