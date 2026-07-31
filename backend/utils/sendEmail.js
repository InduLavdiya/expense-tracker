const nodemailer = require("nodemailer");

// ======================================
// Send Email
// ======================================

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({

        host: "smtp-relay.brevo.com",

        port: 587,

        secure: false,

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASS

        }

    });

    try {

        console.log("Skipping verify()...");
        console.log("Sending email to:", options.email);

        const info = await transporter.sendMail({

            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,

            to: options.email,

            subject: options.subject,

            html: options.message

        });

        console.log("Email sent successfully");
        console.log(info);

    }

    catch(error){

        console.error("EMAIL ERROR:");
        console.error(error);

        throw error;

    }

};

module.exports = sendEmail;