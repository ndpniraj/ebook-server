import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

interface VerificationMailOptions {
  link: string;
  to: string;
}

const TOKEN = process.env.MAILTRAP_TOKEN!;

const client = new MailtrapClient({ token: TOKEN });

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

const sendVerificationMailProd = () => {
  const sender = {
    email: "no-reply@fsniraj.dev",
    name: "User Sign In",
  };
  const recipients = [
    {
      email: "ndpniraj@gmail.com",
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      text: "Congrats for sending test email with Mailtrap!",
      category: "Integration Test",
    })
    .then(console.log, console.error);
};

const sendVerificationTestMail = async (options: VerificationMailOptions) => {
  await transport.sendMail({
    to: options.to,
    from: process.env.VERIFICATION_MAIL,
    subject: "Auth Verification",
    html: `
            <div>
              <p>Please click on <a href="${options.link}">this link</a> to verify you account.</p>
            </div> 
          `,
  });
};

const mail = {
  async sendVerificationMail(options: VerificationMailOptions) {
    if (process.env.NODE_ENV === "development")
      await sendVerificationTestMail(options);
    else sendVerificationMailProd();
  },
};

export default mail;
