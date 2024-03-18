const expressAsyncHandler = require('express-async-handler');
const { transporter } = require('../services/nodemailer');

const sendOtp = expressAsyncHandler(async (req, res) => {
    const { userMail } = req.body;
    
    const otp = generateOTP();

    const message = `<center><div style="width:550px;">
                        <h1 style="text-align:center;font-size:24px;font-weight:bold;">Action Required: One-Time Verification Code</h1>

                        <p style="font-size:1rem;line-height:1.25;text-align:justify;">You are receiving this email because a request was made for a one-time code that can be used for authentication.</p>

                        <p style="font-size:1rem;line-height:1.25;text-align:justify;">Please enter the following code for verification:</p>

                        <center style="font-size:20px;margin-top:1.375rem;margin-bottom:1.375rem;"><b style="letter-spacing:5px;background-color:#ccc;border-radius:0.375rem;padding: 0.75rem;">${otp}</b></center>

                        <p style="font-size:1rem;line-height:1.25;text-align:justify;">If you encounter any issues during the registration process or have questions about our services, feel free to reach out to our support team for assistance.</p>
                    </div></center>`;
    const option = {
        from: 'maThECH',
        to: userMail,
        subject: 'One-Time verification code',
        html: message
    };
    
    await transporter.sendMail(option);
    res.status(200).send({otp: otp});
});

const generateOTP = () => {
    let otp = 0;

    // Generates a randomized 6 digit one-time-password
    for (let x=0; x !== 6; x++) {
        var randomDigit = Math.floor(Math.random() * 10);
        otp += randomDigit.toString();
    }

    return otp;
};

module.exports = {sendOtp};