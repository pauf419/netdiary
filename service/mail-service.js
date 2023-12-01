const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: "lebedevpavel0511@gmail.com",
                pass: "nzpp fsaq xkmi hadh"
            }
        })
    }

    async sendActivationMail(to, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h3>Here is your verification code: <h2 style="font-family: consolas, sans-serif;"> ${code} </h2> </h3>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
