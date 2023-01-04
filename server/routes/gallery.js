const express = require("express");
const persist = require("../helpers/persist");
const validator = require("validator");

const galleryRouter = express.Router();

galleryRouter.get("/", getGallery);
galleryRouter.put("/add", addImage);

async function getGallery(request, response) {
  try {
    const images = persist.getGalleryImages();

    response.status(200).json(images);
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function addImage(request, response) {
  const img = request.body.img;
  const title = request.body.title;

  try {
    const result = validateAddImage(img, title);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.addImageToGallery(img, title);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateAddImage(img, title) {
  if (!img) {
    return { statusCode: 400, message: "Missing Image" };
  }
  if (!title) {
    return { statusCode: 400, message: "Missing Title" };
  }
  if (!validator.isURL(img)) {
    return { statusCode: 400, message: "Invalid Image" };
  }
  const image = persist.getGalleryImageByURL(img);
  if (image) {
    return { statusCode: 409, message: "Image already exists" };
  }
}

module.exports = galleryRouter;
