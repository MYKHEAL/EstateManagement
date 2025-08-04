import nodemailer from 'nodemailer';

const sendEmail = async(to, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            password: process.env.MAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from: `"Real Estate App" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
}

export default sendEmail;