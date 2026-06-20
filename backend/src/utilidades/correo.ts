import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendTemporaryPasswordEmail = async (email: string, tempCode: string, name: string) => {
  const mailOptions = {
    from: `"Hammer Subastas" <${process.env.MAIL_USER}>`,
    to: email,
    subject: '¡Tu registro de postor ha sido aprobado!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>¡Hola, ${name}!</h2>
        <p>Tu investigación de antecedentes fue exitosa y has sido admitido.</p>
        <p>Contraseña Temporal: <strong style="font-size: 18px; color: #007bff;">${tempCode}</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`\n📬 [MAIL ENVIADO] a ${email}\n`);
};
