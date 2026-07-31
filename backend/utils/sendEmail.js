const nodemailer = require("nodemailer");

// ======================================
// Send Email
// ======================================

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({

        host: "smtp-relay.brevo.com",

        port: 2525,

        secure: false,

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },

        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000

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

        console.log("========== EMAIL SENT SUCCESSFULLY ==========");
        console.log(info);

    }

    catch (error) {

        console.error("========== EMAIL ERROR ==========");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Response:", error.response);
        console.error("ResponseCode:", error.responseCode);
        console.error(error);

        throw error;

    }

};

module.exports = sendEmail;