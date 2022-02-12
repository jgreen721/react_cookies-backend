const router = require('express').Router();
const apiRoutes = require('./api');
const {emailClientMsg,emailClientLink} = require("../utils/nodeMailer")
const client = require("../client");
const {v4} = require("uuid")
const {hashPW,comparePW} = require("../utils/bcrypt")
const sanitizeData = require("../utils/sanitizeData")
const stock_images = require('../utils/stock_images.json');
const { compare } = require('bcrypt');
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



router.post('/login',async(req,res)=>{
    console.log("Login",req.body)
    let sanityUser = await client.fetch(`*[_type == 'customer' && username == '${req.body.username}']`)
    console.log(sanityUser)
    if(!sanityUser.length){
        return res.json({msg:"no user of that name exists, try signing up"})
    }
    let pwResult = await comparePW(req.body.password,sanityUser[0].password);
    if(!pwResult)return res.json({msg:"invalid password!"})
    res.status(200).json({msg:"login successful", status:200, payload:{username:sanityUser[0].username,image:sanityUser[0].avatar.image}})

})

// console.log(client)

router.post('/register/:service',async(req,res)=>{
    console.log("Register",req.body)
    let sessionId = v4();
    if(!sanitizeData(req.body))return res.json({msg:"error-- invalid input data"})

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
    if(req.params.service === "client"){
    await emailClientLink('justngreen721@gmail.com',`http://localhost:3000/?token=${sessionId}`)
    // res.setHeader("set-cookie",`name=${sessionId};max-age=60 * 30`)
    res.status(200).json({msg:"Succesful registration. Check your email for a link to follow! :)",cookie:`name=${sessionId};max-age=1800`})
    }
    else{
        console.log(req.params.service);
        res.status(200).json({msg:"successful login from google",status:200,payload:{username:newUser.username,image:newUser.avatar}})
    }

})



module.exports = router;