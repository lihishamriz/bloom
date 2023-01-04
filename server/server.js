const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const galleryRouter = require("./routes/gallery");
const clubRouter = require("./routes/club");
const reviewsRouter = require("./routes/reviews");
const contactUsRouter = require("./routes/contact-us");
const adminRouter = require("./routes/admin");
const utils = require("./helpers/utils");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", (request, response, next) => {
  const id = request.cookies?.bloom;
  const email = utils.getEmailBySessionId(id);

  if (email) {
    response.locals.email = email;
  }

  next();
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.use("/", (request, response, next) => {
  const email = response.locals.email;

  if (!email) {
    response.status(401).end();
  } else {
    next();
  }
});

app.use("/cart", cartRouter);
app.use("/gallery", galleryRouter);
app.use("/club", clubRouter);
app.use("/reviews", reviewsRouter);
app.use("/contact-us", contactUsRouter);

app.use("/", (request, response, next) => {
  const email = response.locals.email;

  if (email !== "admin") {
    response.status(401).end();
  } else {
    next();
  }
});

app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
