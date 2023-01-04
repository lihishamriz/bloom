const express = require("express");
const persist = require("../helpers/persist");
const shortUUID = require("short-uuid");
const validator = require("validator");

const adminRouter = express.Router();

adminRouter.get("/activities", getActivities);
adminRouter.put("/add-product", addProduct);
adminRouter.delete("/remove-product/:id", removeProduct);

async function getActivities(request, response) {
  try {
    const activities = persist.getActivities();

    response.status(200).json(activities);
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function addProduct(request, response) {
  const name = request.body.name;
  const description = request.body.description;
  const price = request.body.price;
  const image = request.body.image;

  try {
    const result = validateAddProduct(name, description, price, image);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.addProduct({
      id: shortUUID.generate(),
      name,
      description,
      price,
      image,
    });
    const products = persist.getProducts();

    response.status(200).json({ products });
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function removeProduct(request, response) {
  const id = request.params.id;

  try {
    const result = validateRemoveProduct(id);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.removeProductById(id);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateAddProduct(name, description, price, image) {
  if (!name) {
    return { statusCode: 400, message: "Missing Name" };
  }
  if (!description) {
    return { statusCode: 400, message: "Missing Description" };
  }
  if (!price) {
    return { statusCode: 400, message: "Missing Description" };
  }
  if (!image) {
    return { statusCode: 400, message: "Missing Image" };
  }
  if (!validator.isNumeric(price)) {
    return { statusCode: 400, message: "Invalid Price" };
  }
  if (!validator.isURL(image)) {
    return { statusCode: 400, message: "Invalid Image" };
  }
  const product = persist.getProductByName(name);
  if (product) {
    return { statusCode: 409, message: "Product already exists" };
  }
}

function validateRemoveProduct(id) {
  if (!id) {
    return { statusCode: 400, message: "Missing Product ID" };
  }
  const product = persist.getProductById(id);
  if (!product) {
    return { statusCode: 404, message: "Product not found" };
  }
}

module.exports = adminRouter;
