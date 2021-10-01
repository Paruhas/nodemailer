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
    const { userEmail, userPass, receiverEmail } = req.body;

    if (!userEmail || userEmail === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side)" });
    }
    if (!userPass || userPass === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side)" });
    }
    if (!receiverEmail || receiverEmail === "") {
      return res
        .status(400)
        .json({ message: "some field is missing (sever side)" });
    }

    // // comment bcz want to send multiple email
    // if (!isEmail.test(userEmail) || !isEmail.test(receiverEmail)) {
    //   return res.status(400).json({ message: "email is invalid format" });
    // }

    // if userPass error need to fix "App Password" or "Less secure app access"
    const transport = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: userEmail,
        pass: userPass,
      },
      from: userEmail,
    });

    const mailObject = {
      from: userEmail,
      to: receiverEmail,
      subject: "verify_code",
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
