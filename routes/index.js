const router = require('express').Router();
const apiRoutes = require('./api');
const {emailClientMsg,emailClientLink} = require("../utils/nodeMailer")
const client = require("../client");
const {v4} = require("uuid")
const {hashPW,comparePW} = require("../utils/bcrypt")
const stock_images = require('../utils/stock_images.json')
router.use("/api",apiRoutes)



router.get('/session',async(req,res)=>{
    console.log("/session pinged");
    console.log(req.headers)
    let token = req.headers['auth-token'];
    console.log("Token",token);

    let customer = await client.fetch(`*[_type == 'customer' && sessionId == '${token}']`)
    console.log("Customer",customer)

    let payload = {
        username:customer[0].username,
        email:customer[0].email,
        image:customer[0].avatar,
        expires:'max-age=1800'
    }
 
   
  res.json(payload)
})



router.post('/login',(req,res)=>{
    console.log("Login",req.body)
    res.status(200).json({msg:"login payload received"})
})

// console.log(client)

router.post('/register',async(req,res)=>{
    console.log("Register",req.body)
    let sessionId = v4();

    let newUser = {_id:req.body?._id ? req.body._id : v4(),
                   _type:"customer",
                   sessionId,
                   username:req.body.username,
                   email:req.body.email,
                   password:req.body.password ? await hashPW(req.body.password) : "",
                   avatar:req.body.image ? req.body.image : stock_images[Math.random() * stock_images.length | 0] ,
                   prefers: ""}
                   console.log(newUser)
    let result = await client.createIfNotExists(newUser)
    console.log(result)
    await emailClientLink(newUser.email,`http://localhost:3000/?token=${sessionId}`)
    // res.setHeader("set-cookie",`name=${sessionId};max-age=60 * 30`)
    res.status(200).json({msg:"register payload received, cookies been set! 🍪",cookie:`name=${sessionId};max-age=1800`})

})



module.exports = router;