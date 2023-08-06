const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { isEmail } = require("validator")
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        requred:[true, "Please provide name"],
        minlength: [3, "Name character can not be lower than 3"],
        maxlength: [20," Name character can not exceed 20"],
    },
    email: {
        type:String,
        requred:[true, "Email address is required"],
        validate:[isEmail, "please enter a valid email address"],
        unique: true 
    },
    password: {
        type:String,
        requred:[true, "Please provide password"],
        minlength: [7, "password length must be greater than 6 characters"],
    },
    phonenumber:{
        type:Number,
        trim:true
    },
    isOpen:{
        type:Boolean,
        default:true
    },

}, {timestamps: true})

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFESPAN})
}

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}
const User = mongoose.model("User", userSchema);

module.exports = User

 