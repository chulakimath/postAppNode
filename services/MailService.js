import nodemailer from "nodemailer";
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const MAIL_FROM_NAME=process.env.MAIL_FROM_NAME;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
})

export const sendMail = async (toAddress, subject, body) => {
    if (!toAddress || !subject || !body) {
        return 0;
    }
    try {
        return await transporter.sendMail({
            from:`${MAIL_FROM_NAME} ${MAIL_USER}`,
            to:toAddress,
            subject:subject,
            html:body
        })
    } catch (error) {
        console.log("Error - MailService - sendMail - ", error)
    }
}