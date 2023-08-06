const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports = async (email, subject, text)=>{
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
          h1 {
            color: #007bff;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>Dear User, Welcome to our app!</h1>
        <p>This is the HTML version of the email. You can add your customized content here.</p>
        <p>Here's a button in the email:</p>
        <a class="button" href="http://example.com">Click Here</a>
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