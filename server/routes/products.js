const express = require("express");
const persist = require("../helpers/persist");

const productsRouter = express.Router();

productsRouter.get("/", getProducts);

async function getProducts(request, response) {
  try {
    const products = persist.getProducts();

    response.status(200).json(products);
  } catch (error) {
    response.status(500).end();
  }
}

module.exports = productsRouter;
