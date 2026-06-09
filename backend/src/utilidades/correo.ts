import nodemailer from 'nodemailer';

// Función para crear el transporte de manera dinámica
const getTransporter = async () => {
  // Si estamos en desarrollo, creamos una cuenta de pruebas automática
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true para puerto 465, false para otros puertos
    auth: {
      user: testAccount.user, // Usuario generado automáticamente por Ethereal
      pass: testAccount.pass, // Contraseña generada automáticamente
    },
  });
};

export const sendTemporaryPasswordEmail = async (email: string, tempCode: string, name: string) => {
  const transporter = await getTransporter();

  const mailOptions = {
    from: '"Subastas Universitarias" <no-reply@subastas.com>',
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

  const info = await transporter.sendMail(mailOptions);

  // Imprime en la consola una URL para abrir en el navegador 
  // y ver el mail real con el diseño HTML que se envió.
  console.log(`\n📬 [MAIL ENVIADO] Podés ver el correo real ingresando acá: ${nodemailer.getTestMessageUrl(info)} \n`);
};