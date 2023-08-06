const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:[true,"Please provide *Title* name"],
        maxlength:30
    },
    postcontent:{
        type:String,
        validate: {
            validator: function (text) {
              return text.length <= 100;
            },
            message: 'Post text exceeds the character limit.',
        },
    },
    views:{
        type:Number,
        default: 0
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:[true, "Please provide user"]
    }
}, {timestamps: true})

const badWords = [
    'mad', 
    'Stupid', 
    'fuck', 
    "Cumbubble", 
    "F*ck you", 
    "Shitbag", 
    "Asshole", 
    "Bastard",
    "Bitch",
    "Dickhead",
    "C*nt",
    "Son of a bitch",
    "Bollocks",
    "Penis",
    "Dick",
    "Boobs",
    "Breast",
    "Booty",
    "Sex",
    "Ass",
    "Prick",
    "Pant",
    "bitch",
    "Bra",
    "Pussy",
];

postSchema.pre('save', function (next) {
    if (!this.title || !this.postcontent) {
      
      return next();
    }
  
    const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  
    if (this.title.match(regex) || this.postcontent.match(regex)) {
      const error = new Error('This Post contains inappropriate language and does not follow our community rules.');
      return next(error);
    }
  
    next();
  });


module.exports = mongoose.model('userPost', postSchema)