 const nodemailer = require('nodemailer')

const transtportmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
const sendOtp = async (email, createOtp) => {
    
    const mailOtp = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `${email} -> Sent OTP`,
        text: `Dear User,
        We received a request to reset your password. Please use the following OTP (One-Time Password) to proceed:

        OTP: ${createOtp}

        Note: This OTP is valid for 10 minutes and can be used only once. Please do not share it with anyone for security reasons.

        If you did not initiate this request, please ignore this email.

        Regards,  
        Fleet Management Team`

    }
    await transtportmail.sendMail(mailOtp);
}
const resetPassword = async (email)=>{
    const mailmsg = {

        from: process.env.EMAIL_USER,
        to: email,
        subject: `${email} -> Reset Password`,
        text: `Dear User,
        We received a request to reset your password.
        Your password Reset Successfully
        Regards,  
        Fleet Management Team`
    }
    await transtportmail.sendMail(mailmsg);
}
module.exports = {sendOtp,resetPassword }