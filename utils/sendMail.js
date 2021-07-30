import nodemailer from 'nodemailer';

const sendMail = (options) => {
    const tranporter = nodemailer.createTransport({
        pool: true,
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // use TLS
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to:  options.to,
        subject: options.subject,
        html: options.text
    }

    tranporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.error();
        }else{
            console.log(info0);
        }
    })
}

export {sendMail};