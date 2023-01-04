const fs = require("fs");
const path = require("path");
const shortUUID = require("short-uuid");

let filePath = path.join(__dirname, "../data");
if (process.env.NODE_ENV === "test") {
  filePath = path.join(__dirname, "../tests/data");
}

const USERS_FILE = `${filePath}/users.json`;
const SESSIONS_FILE = `${filePath}/sessions.json`;
const PRODUCTS_FILE = `${filePath}/products.json`;
const CARTS_FILE = `${filePath}/carts.json`;
const PURCHASES_FILE = `${filePath}/purchases.json`;
const ACTIVITIES_FILE = `${filePath}/activities.json`;
const GALLERY_FILE = `${filePath}/gallery.json`;
const REVIEWS_FILE = `${filePath}/reviews.json`;

function getProducts() {
  const productsData = fs.readFileSync(PRODUCTS_FILE);
  return JSON.parse(productsData).products;
}

function setProducts(products) {
  const productsData = JSON.stringify({ products });
  fs.writeFileSync(PRODUCTS_FILE, productsData, "utf8");
}

function getProductById(productId) {
  const products = getProducts();
  return products.find((product) => product.id === productId);
}

function getProductByName(productName) {
  const products = getProducts();
  return products.find((product) => product.name === productName);
}

function addProduct(product) {
  const products = getProducts();
  products.push(product);
  setProducts(products);
}

function removeProductById(id) {
  let products = getProducts();
  products = products.filter((product) => product.id !== id);
  setProducts(products);
}

function getCarts() {
  const cartsData = fs.readFileSync(CARTS_FILE);
  return JSON.parse(cartsData).carts;
}

function setCarts(carts) {
  const cartsData = JSON.stringify({ carts });
  fs.writeFileSync(CARTS_FILE, cartsData, "utf8");
}

function getCartByEmail(email) {
  const carts = getCarts();
  const userCart = carts.find((cart) => cart.email === email);
  return userCart?.products || [];
}

function addToCart(email, productName) {
  let carts = getCarts();
  carts =
    carts.map((cart) => {
      if (cart.email === email) {
        cart.products.push({ id: shortUUID.generate(), name: productName });
      }
      return cart;
    }) || [];
  setCarts(carts);
}

function removeFromCart(email, cartProductId) {
  let carts = getCarts();
  carts = carts.map((cart) => {
    if (cart.email === email) {
      cart.products = cart.products.filter(
        (cartProduct) => cartProduct.id !== cartProductId
      );
    }
    return cart;
  });
  setCarts(carts);
}

function getUsers() {
  const usersData = fs.readFileSync(USERS_FILE);
  return JSON.parse(usersData).users;
}

function setUsers(users) {
  const usersData = JSON.stringify({ users });
  fs.writeFileSync(USERS_FILE, usersData, "utf8");
}

function getUserByEmail(userEmail) {
  const users = getUsers();
  return users.find((user) => user.email === userEmail);
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

function getSessions() {
  const sessionsData = fs.readFileSync(SESSIONS_FILE);
  return JSON.parse(sessionsData).sessions;
}

function setSessions(sessions) {
  const sessionsData = JSON.stringify({ sessions });
  fs.writeFileSync(SESSIONS_FILE, sessionsData, "utf8");
}

function addSession(session) {
  const sessions = getSessions();
  sessions.push(session);
  setSessions(sessions);
}

function removeSessionByKey(key) {
  let sessions = getSessions();
  sessions = sessions.filter((session) => session.key !== key);
  setSessions(sessions);
}

function getActivities() {
  const activitiesData = fs.readFileSync(ACTIVITIES_FILE);
  return JSON.parse(activitiesData).activities;
}

function addActivity(activity) {
  const activities = getActivities();
  activities.push(activity);
  fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify({ activities }), "utf8");
}

function getReviews() {
  const reviewsData = fs.readFileSync(REVIEWS_FILE);
  return JSON.parse(reviewsData).reviews;
}

function setReviews(reviews) {
  const reviewsData = JSON.stringify({ reviews });
  fs.writeFileSync(REVIEWS_FILE, reviewsData, "utf8");
}

function addReview(review) {
  const reviews = getReviews();
  reviews.unshift(review);
  setReviews(reviews);
}

function getGalleryImages() {
  const galleryData = fs.readFileSync(GALLERY_FILE);
  return JSON.parse(galleryData).images;
}

function getGalleryImageByURL(url) {
  const images = getGalleryImages();
  return images.find((image) => image.img === url);
}

function setGalleryImages(images) {
  const imagesData = JSON.stringify({ images });
  fs.writeFileSync(GALLERY_FILE, imagesData, "utf8");
}

function addImageToGallery(image, title) {
  const images = getGalleryImages();
  images.push({ img: image, title: title });
  setGalleryImages(images);
}

function getPurchases() {
  const purchasesData = fs.readFileSync(PURCHASES_FILE);
  return JSON.parse(purchasesData).purchases;
}

function addPurchase(purchase) {
  const purchases = getPurchases();
  purchases.push(purchase);
  fs.writeFileSync(PURCHASES_FILE, JSON.stringify({ purchases }), "utf8");
}

module.exports = {
  getUsers,
  setUsers,
  getUserByEmail,
  addUser,
  getSessions,
  setSessions,
  addSession,
  removeSessionByKey,
  getProducts,
  setProducts,
  getProductById,
  getProductByName,
  addProduct,
  removeProductById,
  getCarts,
  setCarts,
  getCartByEmail,
  addToCart,
  removeFromCart,
  getPurchases,
  addPurchase,
  getGalleryImages,
  getGalleryImageByURL,
  addImageToGallery,
  getReviews,
  addReview,
  getActivities,
  addActivity,
};
