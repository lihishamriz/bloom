const express = require("express");
const persist = require("../helpers/persist");
const validator = require("validator");

const cartRouter = express.Router();

cartRouter.get("/", getCart);
cartRouter.put("/add", addToCart);
cartRouter.delete("/remove/:id", removeFromCart);
cartRouter.post("/checkout", checkout);

async function getCart(request, response) {
  const email = response.locals.email;

  try {
    const cart = persist.getCartByEmail(email);
    const cartToReturn = [];
    cart.forEach((cartItem) => {
      const product = persist.getProductByName(cartItem.name);
      if (product) {
        delete product.id;
        cartToReturn.push({ id: cartItem.id, ...product });
      } else {
        persist.removeFromCart(email, cartItem.id);
      }
    });

    response.status(200).json(cartToReturn);
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function addToCart(request, response) {
  const email = response.locals.email;
  const productName = request.body.productName;

  try {
    const result = validateAddToCart(productName);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.addToCart(email, productName);
    persist.addActivity({
      email: email,
      type: "addToCart",
      productName: productName,
      date: new Date().toJSON(),
    });

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function removeFromCart(request, response) {
  const email = response.locals.email;
  const cartProductId = request.params.id;

  try {
    const result = validateRemoveFromCart(cartProductId);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    persist.removeFromCart(email, cartProductId);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

async function checkout(request, response) {
  const email = response.locals.email;
  const details = request.body.details || {};
  const checkoutProducts = request.body.products || [];

  try {
    const result = validateCheckout(details, checkoutProducts);
    if (result) {
      return response.status(result.statusCode).json(result.message);
    }

    // get product names
    const cart = persist.getCartByEmail(email);
    const purchaseProducts = checkoutProducts.map((checkoutProduct) => {
      const product = cart.find(
        (cartProduct) => cartProduct.id === checkoutProduct
      );
      return product?.name;
    });

    // remove from cart
    let carts = persist.getCarts();
    carts = carts.map((cart) => {
      if (cart.email === email) {
        cart.products = cart.products.filter(
          (product) => !checkoutProducts.includes(product.id)
        );
      }
      return cart;
    });
    persist.setCarts(carts);

    const purchase = {
      email,
      products: purchaseProducts,
      date: new Date().toJSON(),
    };

    persist.addPurchase(purchase);

    response.status(200).end();
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
}

function validateAddToCart(productName) {
  if (!productName) {
    return { statusCode: 400, message: "Missing Product Name" };
  }
  const product = persist.getProductByName(productName);
  if (!product) {
    return { statusCode: 404, message: "Product not found" };
  }
}

function validateRemoveFromCart(id) {
  if (!id) {
    return { statusCode: 400, message: "Missing Cart Product ID" };
  }
}

function validateCheckout(details, products) {
  if (!details.address) {
    return { statusCode: 400, message: "Missing Address" };
  }
  if (!details.city) {
    return { statusCode: 400, message: "Missing City" };
  }
  if (!details.cardNumber) {
    return { statusCode: 400, message: "Missing Card Number" };
  }
  if (!details.cardExpirationDate) {
    return { statusCode: 400, message: "Missing Card Expiration Date" };
  }
  if (!details.cardCVV) {
    return { statusCode: 400, message: "Missing Card CVV" };
  }
  if (products.length === 0) {
    return { statusCode: 400, message: "Missing Products" };
  }
  if (!validator.isCreditCard(details.cardNumber)) {
    return { statusCode: 400, message: "Invalid Card Number" };
  }
  if (!validator.isDate(new Date(details.cardExpirationDate))) {
    return { statusCode: 400, message: "Invalid Expiration Date" };
  }
  if (
    !validator.isNumeric(details.cardCVV) ||
    parseInt(details.cardCVV) < 100 ||
    parseInt(details.cardCVV) > 999
  ) {
    return { statusCode: 400, message: "Invalid CVV" };
  }
}

module.exports = cartRouter;
