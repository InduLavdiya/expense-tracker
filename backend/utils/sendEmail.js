const nodemailer = require("nodemailer");

// ======================================
// Send Email
// ======================================

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    },

    tls: {

        rejectUnauthorized: false

    }

});

    const mailOptions = {

        from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,

        to: options.email,

        subject: options.subject,

        html: options.message

    };
    console.log("Sending email to:", options.email);

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");



};

module.exports = sendEmail;