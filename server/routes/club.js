const express = require("express");
const persist = require("../helpers/persist");

const clubRouter = express.Router();

clubRouter.get("/is-club-member", getIsClubMember);
clubRouter.post("/join-the-club", addToClub);

async function getIsClubMember(request, response) {
  const email = response.locals.email;

  try {
    const user = persist.getUserByEmail(email);

    response.status(200).json({ isClubMember: user?.club });
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function addToClub(request, response) {
  const email = response.locals.email;

  try {
    let users = persist.getUsers();
    users = users.map((user) => {
      if (user.email === email) {
        user.club = true;
      }

      return user;
    });
    persist.setUsers(users);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

module.exports = clubRouter;
