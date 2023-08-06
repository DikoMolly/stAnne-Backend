const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
       return res.status(500).json({error: "Unauthorized user"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, name: payload.name}
        next(); 
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}


module.exports = auth;