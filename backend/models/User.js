const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    monthlyLimit:{
        type:Number,
        default:0
    },

    resetPasswordToken:{
        type:String
    },

    resetPasswordExpire:{
        type:Date
    }

},
{
    timestamps:true
}
);

module.exports = mongoose.model("User", userSchema);