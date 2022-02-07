require("dotenv").config()

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const routes = require("./routes")
const app = express();
const PORT = process.env.PORT || 4455;

app.use(express.static("public"))
app.use(express.json())
app.use(cors({origin:process.env.CLIENT_URL}))
app.use(cookieParser())




app.use(routes)






app.listen(PORT,console.log(`Listening in on port ${PORT}, ${process.env.USER}`))