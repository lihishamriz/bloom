const express = require("express");
const nodemailer = require("nodemailer");
const utils = require("../helpers/utils");
require("dotenv").config();

const bloomEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

const contactUsRouter = express.Router();

contactUsRouter.post("/", contactUs);

async function contactUs(request, response) {
  const userEmail = response.locals.email;
  const subject = request.body.subject;
  const content = request.body.content;

  try {
    const result = validateContactUs(subject, content);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    const safeSubject = String(subject)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    const safeContent = String(content)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const internalMailOptions = {
      from: bloomEmail,
      to: bloomEmail,
      subject: `New message from a user - ${safeSubject}`,
      text: `The user: ${userEmail} sent the following message: ${safeContent}`,
    };

    const userMailOptions = {
      from: bloomEmail,
      to: userEmail,
      subject: "Thank you for contacting Bloom!",
      text: "Your message was sent successfully and we will handle it in the following days. Thank you!",
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: bloomEmail,
        pass: password,
      },
    });

    await utils.sendMail(transporter, internalMailOptions);

    if (userEmail !== "admin") {
      await utils.sendMail(transporter, userMailOptions);
    }

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateContactUs(subject, content) {
  if (!subject) {
    return { statusCode: 400, message: "Missing Subject" };
  }
  if (!content) {
    return { statusCode: 400, message: "Missing Content" };
  }
}

module.exports = contactUsRouter;
