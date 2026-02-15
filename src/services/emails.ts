async function sendMail(toEmail: string, subject: string, bodyEmail: string) {
  const response = await fetch("https://api.arotec.ao/api/enviar-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: toEmail,
      subject: subject,
      body: bodyEmail,

      //  Transport Data
      email: process.env.API_EMAIL_FROM,
      password: process.env.API_EMAIL_PASSWORD,
      nameRemetent: process.env.API_EMAIL_NAME,
      emailFrom: process.env.API_EMAIL_FROM,
    }),
  });
}

export { sendMail };
