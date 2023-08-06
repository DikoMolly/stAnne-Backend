const User = require("../model/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const { check, validationResult } = require('express-validator');
require("dotenv").config()




const handleErrors = (err)=>{
  console.log(err.message, err.code);
  let errors = {name:"", email:"", password:""};
  // duplicate error code
  if(err.code === 11000){
    errors.email = `Email already exist, choose a different email`
    return errors;
  }
  // validation errors
  if(err.message.includes("User validation failed")){
    Object.values(err.errors).forEach(({properties}) =>{
      errors[properties.path] = properties.message
    })
  }

  // incorrect email from login
  if(err.message === "incorrect email"){
    errors.email = "Email is invalid or user does not exist"
  }
  if(err.message === "incorrect password"){
    errors.password = "Incorrect Password"
  }
  if(err.message === "CastError"){
    err.id = `No item with the specific id of ${err.value}`
  }
   
  if(err.message === "")

  return errors
} 

const register = async (req, res)=>{
  try {

    const user = await User.create({...req.body});

    const token = user.createJWT();

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
                width:100%;
                height:450px;
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
            <p>Email Verification </p>
            <p className="verifyText">
              Thank you for signing up! We're excited to have you as a member of our community. 
              To get started, please verify your email address by clicking on the "Verify Email" button
              in the email we've sent to your inbox. This will help ensure the security of your account
              and allow you to access all the features of our platform.
            </p>
            <a class="button" href="https://www.facebook.com">Verify Email</a>
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
         
    await sendMail(user.email, " St Anne's catholic church ");

            
    res.status(201).json( {user: { name: user.name}, token})


  } catch (error) {
    
    const errors = handleErrors(error)
    console.log(errors)
    res.status(500).json({ errors })

  }
}



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on email
    const user = await User.findOne({ email });

    // If user not found, return an authentication error
    if (!user) {
      return res.status(401).json({ error: "The email address you entered isn't connected to an account" });
    }

    // Compare the provided password with the stored password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // If everything is correct, generate and send the token
    const token = user.createJWT();
    res.status(200).json({ user, token });
  } catch (error) {
   
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};


module.exports = {
    register,
    login
}