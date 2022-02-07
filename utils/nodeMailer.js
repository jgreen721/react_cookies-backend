const nodeMailer = require("nodemailer");


const transporter = nodeMailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "jgreen72181@hotmail.com",
        pass: "n!kki72181"
    },
    tls: {
        ciphers:'SSLv3'
    }
});




async function emailClientMsg(to,sub,msg){
    let options = {
        to,
        from:'jgreen72181@hotmail.com',
        subject:sub,
        text:msg
    }
    let result = await transporter.sendMail(options)
    console.log("Mail(Msg)Result",result)
}


async function emailClientLink(to,link){
    let options = {
        to,
        from:'jgreen72181@hotmail.com',
        subject:'- Welcome to Moms Homebaked Cookies! :) -',
        html:`<p>Congrats on registering. Just one final step before experiencing the delicious deals and experience of Moms HomeBaked Cookies. Just click the verify link! <a href=${link}>Click</a> and your own your way!🍪😎`
    }

    let result = await transporter.sendMail(options)
    console.log("Mail(Link)Result",result)
}




module.exports = {emailClientMsg,emailClientLink}