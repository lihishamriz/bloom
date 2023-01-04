const express = require("express");
const persist = require("../helpers/persist");
const validator = require("validator");

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.put("/add", addReview);

async function getReviews(request, response) {
  try {
    const reviews = persist.getReviews();

    response.status(200).json(reviews);
  } catch (error) {
    response.status(500).end();
  }
}

async function addReview(request, response) {
  const stars = request.body.stars;
  const comment = request.body.comment;
  const date = request.body.date || new Date().toJSON();

  try {
    const result = validateAddReview(stars, comment);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.addReview({ stars, comment, date });

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateAddReview(stars, comment) {
  if (!stars) {
    return { statusCode: 400, message: "Missing Stars" };
  }
  if (!comment) {
    return { statusCode: 400, message: "Missing Comment" };
  }
  if (typeof stars !== "number" && !validator.isNumeric(stars)) {
    return { statusCode: 400, message: "Invalid Stars" };
  }
}

module.exports = reviewsRouter;
