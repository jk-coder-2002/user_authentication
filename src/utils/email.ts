import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendActivationEmail = async (email: string, fullname: string): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Account Activated',
    html: `
      <h1>Welcome ${fullname}!</h1>
      <p>Your account has been activated and you can now log in.</p>
      <p>Thank you for using our service.</p>
    `
  };

  transporter.sendMail(mailOptions)
    .then(() => {
      console.log(`Activation email sent to ${email}`);
    })
    .catch((error) => {
      console.error(`Failed to send activation email to ${email}:`, error);
    });
};
