const express = require("express");
const router = express.Router();
const User = require("../model/User")
const Token = require("../model/token")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
// const sendMail = require("../utils/sendEmail")






const forgotpassword = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(400).json({ msg: "Account with the email address does not exist" });
      }
  
      // Generate a random token
      const tokenValue = crypto.randomBytes(20).toString("hex");
  
      // Create a new Token document and save it to the database
      const token = await new Token({
        userId: user._id,
        token: tokenValue,
      }).save();
  
      // Send the password reset link to the user's email
    //   const resetPasswordLink = `http://localhost:8000/api/v1/auth/reset-password/${user._id}/${token.token}`;
    //   const message = `We received a request to reset your password for your account at YourApp. To proceed with resetting your password, click on the link below: \n\n${resetPasswordLink}`;
    
  const sendMail = async (email, subject, text)=>{
    const transporter = nodemailer.createTransport({
        service:process.env.SERVICE,
        auth:{
            user: process.env.USER,
            pass:process.env.PASS
        }
    })

    const html = `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          .container{
            background-color:black;
            color:white;
            width:50%;
            height:350px;
            padding-left:70px;
            padding-top:40px;
            padding-right:25px;
          }
          h1 {
            color: #f2f2f2;
            font-size:20px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: white;
            color: #333;
            text-decoration: none;
            box-shadow:2px 2px 2px lightgrey;
            border-radius: 4px;
            margin-bottom:50px;
          }
          
        </style>
      </head>
      <body>
       <div class="container">
        <h1>Dear ${user.name}!</h1>
        <p>We received a request to reset your password for your account at St Anne's. </p>
        <p>To proceed with resetting your password, click on the button below::</p>
        <a class="button" href="http://localhost:8000/api/v1/auth/reset-password/${user._id}/${token.token}">Click Here</a>
        <p>If you did not make this request, please ignore this message. Your password will remain unchanged.</p>
        </div>
      </body>
    </html>
  `;


    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
        html:html
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

}
   
      // Send the email
      await sendMail(user.email, " St Anne's catholic church ");
    
      // Implement the logic to send the reset password link to the user's email (you can use a library like Nodemailer)
  
      res.status(200).json({ msg: "Password reset link has been sent to your email" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };








  const resetpassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
    
        if (!user) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
    
        let new_password = req.body.new_password;
        let confirm_password = req.body.confirm_password;
    
        if (!new_password || !confirm_password) {
          return res
            .status(400)
            .json({ error: "New Password and Confirm Password are required" });
        }
    
        if (new_password !== confirm_password) {
          return res
            .status(400)
            .json({ error: "Confirm Password must match with New Password" });
        }
    
        const saltRounds = 10; // Choose the number of salt rounds (e.g., 10)
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        const token = await Token.findOne({
            userId:user._id,
            token:req.params.token
        })

        if(!token){
            return res.status(400).json({error:"Password Link has expired or is invalid"})
        }
        await User.updateOne({_id: user._id}, {$set: { password: hashedPassword}})

        await token.deleteOne();

        res.status(200).json({msg:"Password updated successfully!"})
  
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
 

module.exports = {
    forgotpassword,
    resetpassword
}
