const persist = require("../helpers/persist");

function getEmailBySessionId(key) {
  const sessions = persist.getSessions();
  const session = sessions.find((session) => session.key === key);
  return session?.email;
}

async function sendMail(transporter, mailOptions) {
  await transporter.sendMail(mailOptions);
}

module.exports = {
  getEmailBySessionId,
  sendMail,
};
