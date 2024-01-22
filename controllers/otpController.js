const { transporter } = require('../services/nodemailer');

/**
 * The `sendOtp` function generates a one-time password (OTP) and sends it to the user's email address.
 * It uses the `generateOTP` function to create a random 6-digit OTP. The OTP is included in an HTML
 * email message along with instructions for verification. The email is sent using the Nodemailer
 * transporter configured with the Gmail service.
 *
 * @param {Object} reqBody - The request body containing the user's email address.
 * @returns {Object} An object indicating the success of OTP generation and sending, along with a
 * message and the generated OTP.
 * 
 * @throws {Object} An object containing information about the error if an exception occurs during OTP
 * generation or email sending.
 */
module.exports.sendOtp = async (reqBody) => {
    try {
        const { userMail } = reqBody;
        
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
        return {
            success: true,
            message: 'Otp generated',
            otp: otp
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Error generating one-time-password',
            error
        };
    }
};

/**
 * The `generateOTP` function generates a random one-time password (OTP) consisting of 6 digits.
 * It uses a loop to generate each digit randomly and concatenates them to form the 6-digit OTP.
 *
 * @returns {String} A randomly generated one-time password (OTP) consisting of 6 digits.
 */
const generateOTP = () => {
    let otp = '';

    // Generates a randomized 6 digit one-time-password
    for (let x=0; x !== 6; x++) {
        var randomDigit = Math.floor(Math.random() * 10);
        otp += randomDigit.toString();
    }

    return otp;
};