const nodemailer = require("nodemailer");

const getTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        return null;
    }

    return nodemailer.createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

const sendNewRequestNotification = async ({ recipients, requesterName, amount, type, description }) => {
    const transporter = getTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

    if (!transporter || !from || recipients.length === 0) {
        return;
    }

    const requestLabel = type === "purchase" ? "purchase proposal" : "add-money request";

    await transporter.sendMail({
        from,
        to: recipients,
        subject: `New Dabba Fund ${requestLabel}`,
        text: [
            `A new ${requestLabel} needs review.`,
            "",
            `Submitted by: ${requesterName}`,
            `Amount: ₹${amount}`,
            description ? `Description: ${description}` : null,
            "",
            "Open Dabba Fund to review the request.",
        ].filter(Boolean).join("\n"),
    }, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
};

module.exports = { sendNewRequestNotification };