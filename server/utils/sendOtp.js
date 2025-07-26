import nodemailer from 'nodemailer';

const sendOtpEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: '🔐 Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f7f7f7; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #5C3DFF; text-align: center;">🔐 Password Reset Request</h2>
          <p style="font-size: 16px;">Dear User,</p>
          <p style="font-size: 15px;">You recently requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
          
          <div style="font-size: 28px; font-weight: bold; color: #333; text-align: center; margin: 30px 0; letter-spacing: 4px;">
            ${otp}
          </div>
          
          <p style="font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. For your security, do not share this code with anyone.</p>
          <p style="font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0;">
          <footer style="text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Subharti University | All Rights Reserved
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${to}:`, error.message);
    throw new Error('Failed to send OTP email');
  }
};

export default sendOtpEmail;
