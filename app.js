const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const authenticateUser = require("./middleware/auth")

// const helmet = require("helmet");
const cors = require("cors");
// const xss = require("xss-clean");
// const rateLimit = require("express-rate-limit")

require("dotenv").config();

// routers

const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const passwordReset = require("./routes/passwordReset")

// app.set("trust proxy", 1)
// app.use(rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers 
// }))
app.use(express.json())
// app.use(helmet())
app.use(cors())
// app.use(xss())


// used middleware
app.use("/api/v1/auth", authRouter, passwordReset)
app.use("/api/v1/post", authenticateUser, jobRouter);

// connect to DB

const DB = process.env.DB_URI
mongoose.connect(DB)
.then(()=>{
    console.log("mongoDB has connected")
})

.catch((err)=>{
    console.log(err.message)
})
    

app.listen(port, ()=>{console.log("server started at port 5000")})
