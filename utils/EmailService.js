const nodemailer = require('nodemailer');

class EmailService {
    constructor({ service, user, pass }) {
        this.transporter = nodemailer.createTransport({
            service: service, 
            auth: {
                user: user,    
                pass: pass     
            }
        });
    }

    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: this.transporter.options.auth.user, 
            to: to,                                   
            subject: subject,                         
            text: text                                
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent')
            return info;
        } catch (error) {
            console.error('Error occurred:', error.message);
            throw error;
        }
    }
}

const emailService = new EmailService({
    service: 'gmail',
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
});



module.exports = emailService;
