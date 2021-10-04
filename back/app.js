const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");

const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// RegEx for verify Email
const isEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// edit @ Email here
const emailService = "gmail";

app.post("/send", async (req, res, next) => {
  try {
    const { userName, userEmail, userPass, receiverEmail } = req.body;

    if (!userName || userName === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side) [userName]" });
    }
    if (!userEmail || userEmail === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side) [userEmail]" });
    }
    if (!userPass || userPass === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side) [userPass]" });
    }
    if (!receiverEmail || receiverEmail === "") {
      return res.status(400).json({
        message: "some field is missing (sever side) [receiverEmail]",
      });
    }

    // // comment bcz want to send multiple email
    // if (!isEmail.test(userEmail) || !isEmail.test(receiverEmail)) {
    //   return res.status(400).json({ message: "email is invalid format" });
    // }

    // if userPass error need to fix "App Password" or "Less secure app access"
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // // host setting for outlook
      // host: "smtp-mail.outlook.com", // hostname
      // secureConnection: false, // TLS requires secureConnection to be false
      // port: 587, // port for secure SMTP
      service: emailService,
      auth: {
        user: userEmail,
        pass: userPass,
      },
      from: `${userName} <${userEmail}>`,
    });

    const mailObject = {
      from: `${userName} <${userEmail}>`,
      to: receiverEmail,
      subject: `[${userName}] you verify code`,
      text: `Welcome to Blubitex!

      Please click the verification url to complete registration :
      
      000000
      
      * Make sure you are visiting "https://www.blubitex.com" or Blubitex Application!
      
      If you don't recognize the above activity, please contact our official customer representative via the email: info@blubitex.com
      
      Blubitex Team
      This is an automated message, please do not reply.`,
      html: await readFile("../verify_code.html", "utf8"),
    };

    await transport.sendMail(mailObject);

    return res
      .status(200)
      .json({ message: "email sended", userEmail, receiverEmail });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use((req, res, next) => {
  try {
    res.status(400).json({ message: "Path not found." });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Sever start ${PORT}`);
});
