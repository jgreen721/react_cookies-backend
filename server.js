require("dotenv").config()
const CLIENT_URL = process.env.NODE_ENV === "production" ? "https://kind-montalcini-8522f7.netlify.app/" : "http://localhost:3000"
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const routes = require("./routes");
const { emailClientLink } = require("./utils/nodeMailer");
const app = express();
const PORT = process.env.PORT || 4455;

app.use(express.static("public"))
app.use(express.json())
app.use(cors({origin:CLIENT_URL}))
app.use(cookieParser())




app.use(routes)



app.get('/test',(req,res)=>{
    res.json({msg:"dummy data"})
})



app.listen(PORT,console.log(`Listening in on port ${PORT}, ${process.env.USER}`))