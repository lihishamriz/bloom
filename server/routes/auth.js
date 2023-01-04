const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const persist = require("../helpers/persist");
const utils = require("../helpers/utils");

const authRouter = express.Router();

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = 1000 * 60 * 60 * 24;

authRouter.get("/user-details", getUserDetails);
authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

async function getUserDetails(request, response) {
  const key = request.cookies?.bloom;
  let email;

  try {
    if (key) {
      email = utils.getEmailBySessionId(key);
    }
    response.status(200).json({ email });
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function signUp(request, response) {
  const email = request.body.email;
  const password = request.body.password;

  try {
    const result = validateSignUp(email, password);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.addUser({
      email,
      password,
      club: false,
    });

    const carts = persist.getCarts();
    carts.push({ email, products: [] });
    persist.setCarts(carts);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function login(request, response) {
  const email = request.body.email;
  const password = request.body.password;
  const rememberMe = request.body.rememberMe;

  try {
    const result = validateLogin(email, password);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    await handleUserManagement(response, email, password, rememberMe);

    persist.addActivity({
      email: email,
      type: "login",
      date: new Date().toJSON(),
    });

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function logout(request, response) {
  const email = response.locals.email;
  const key = request.cookies?.bloom;

  try {
    if (email) {
      response.clearCookie("bloom");
      persist.removeSessionByKey(key);
      persist.addActivity({
        email: email,
        type: "logout",
        date: new Date().toJSON(),
      });
    }

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateSignUp(email, password) {
  if (!email) {
    return { statusCode: 400, message: "Missing Email" };
  }
  if (!password) {
    return { statusCode: 400, message: "Missing Password" };
  }
  if (!validator.isEmail(email)) {
    return { statusCode: 400, message: "Invalid Email" };
  }
  const user = persist.getUserByEmail(email);
  if (user) {
    return { statusCode: 409, message: "Email already exists" };
  }
}

function validateLogin(email, password) {
  if (!email) {
    return { statusCode: 400, message: "Missing Email" };
  }
  if (!password) {
    return { statusCode: 400, message: "Missing Password" };
  }
  const users = persist.getUsers();
  const user = users.find((user) => user.email === email);
  if (!user) {
    return { statusCode: 404, message: "User not found" };
  }
  if (user.password !== password) {
    return { statusCode: 401, message: "Invalid credentials" };
  }
}

async function handleUserManagement(response, email, password, rememberMe) {
  const maxAge = rememberMe ? ONE_DAY * 10 : ONE_MINUTE * 30;
  const key = await encryptPassword(password);
  response.cookie("bloom", key, { maxAge: maxAge });
  persist.addSession({ key, email });
}

async function encryptPassword(password) {
  return bcrypt.hash(password, 12);
}

module.exports = authRouter;
