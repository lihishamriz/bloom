const request = require("supertest");
const app = require("../server.js");
const path = require("path");
const fs = require("fs");
const persist = require("../helpers/persist");
const utils = require("../helpers/utils");
const { getCartByEmail } = require("../helpers/persist");

const ADMIN_KEY =
  "$2b$12$mJY1L/.I0hR.JEkfS0ZUtOW/1oZC2eiKEu0eBmdw2jSk0ESHP56mq";
const USER_KEY = "$2b$12$y.6n/yn2LVBn8Xhjz3EPzupZi5P3tk9JWYhAHyjVXCHZkg/X9A/Im";
const USERS_FILE = path.join(__dirname, "./data/users.json");
const SESSIONS_FILE = path.join(__dirname, "./data/sessions.json");
const PRODUCTS_FILE = path.join(__dirname, "./data/products.json");
const CARTS_FILE = path.join(__dirname, "./data/carts.json");
const PURCHASES_FILE = path.join(__dirname, "./data/purchases.json");
const ACTIVITIES_FILE = path.join(__dirname, "./data/activities.json");
const GALLERY_FILE = path.join(__dirname, "./data/gallery.json");
const REVIEWS_FILE = path.join(__dirname, "./data/reviews.json");

const users = [
  { email: "admin", password: "admin", club: true },
  { email: "test-user@gmail.com", password: "123456", club: false },
];
const sessions = [
  {
    key: ADMIN_KEY,
    email: "admin",
  },
  {
    key: USER_KEY,
    email: "test-user@gmail.com",
  },
];
const products = [
  {
    id: "iGo7N9Zv1NYMakSeV99j6c",
    name: "Lily and Rose",
    description: "Pink mix of Lilies and Roses",
    price: "50",
    image:
      "https://cdn.shopify.com/s/files/1/0507/3754/5401/t/1/assets/C5375D_LOL_INACTIVE_Eday22_preset_proflowers-mx-hero-lv-new.jpeg?v=1641181477",
  },
  {
    id: "55rckTQegke3aV1VfkaFpt",
    name: "Mixed Tulips",
    description: "15 mixed picnic Tulips",
    price: "60",
    image:
      "https://cdn.shopify.com/s/files/1/0507/3754/5401/t/1/assets/FT215_LOL_preset_proflowers-mx-hero-lv-new.jpeg?v=1644596959",
  },
];
const carts = [
  {
    email: "admin",
    products: [{ id: "hwahkTKaDABiEA6dqk1Kfm", name: "Lily and Rose" }],
  },
  {
    email: "test-user@gmail.com",
    products: [{ id: "koMAZHWetoogpiVBhmbpPj", name: "Mixed Tulips" }],
  },
];
const activities = [
  {
    email: "admin",
    type: "login",
    date: "2022-08-01T00:00:00.000Z",
  },
  {
    email: "test-user@gmail.com",
    type: "addToCart",
    date: "2022-08-02T00:00:00.000Z",
  },
];
const images = [
  {
    img: "https://cdn2.stylecraze.com/wp-content/uploads/2013/11/Top-25-Most-Beautiful-Daisy-Flowers.jpg",
    title: "Daisy",
  },
];
const reviews = [
  {
    stars: 5,
    comment: "Most amazing flowers!",
    date: "2022-09-01T22:28:59.982Z",
  },
];

describe("it should test the server side routes", () => {
  beforeAll(() => {
    initiateMocks();
    initiateData();
  });

  afterAll(() => {
    jest.clearAllMocks();
    clearData();
  });

  describe("it should test /auth", () => {
    it("/auth/user-details should not get user details", async () => {
      const response = await request(app).get("/auth/user-details");
      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual(undefined);
    });

    it("/auth/sign-up should sign-up successfully", async () => {
      const response = await request(app).post("/auth/sign-up").send({
        email: "test@gmail.com",
        password: "1234",
        rememberMe: false,
      });
      expect(response.status).toEqual(200);
      const updatedUsers = persist.getUsers();
      expect(updatedUsers).toEqual(
        expect.arrayContaining([
          { email: "test@gmail.com", password: "1234", club: false },
        ])
      );
    });

    it("/auth/sign-up should return 400 - invalid input", async () => {
      const response = await request(app).post("/auth/sign-up").send({
        password: "1234",
        rememberMe: false,
      });
      expect(response.status).toEqual(400);
    });

    it("/auth/login should login successfully", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@gmail.com",
        password: "1234",
        rememberMe: false,
      });
      expect(response.status).toEqual(200);
      const sessions = persist.getSessions();
      expect(sessions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: "test@gmail.com",
          }),
        ])
      );
    });

    it("/auth/login should return 400 - invalid input", async () => {
      const response = await request(app).post("/auth/login").send({
        password: "1234",
        rememberMe: false,
      });
      expect(response.status).toEqual(400);
    });

    it("/auth/login should return 404 - user not found", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "not-found@gmail.com",
        password: "1234",
        rememberMe: false,
      });
      expect(response.status).toEqual(404);
      expect(response.body).toEqual("User not found");
    });

    it("/auth/login should return 401 - invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@gmail.com",
        password: "12345",
        rememberMe: false,
      });
      expect(response.status).toEqual(401);
      expect(response.body).toEqual("Invalid credentials");
    });

    it("/auth/user-details should get user details", async () => {
      const sessions = persist.getSessions();
      const cookie = sessions[2].key;
      const response = await request(app)
        .get("/auth/user-details")
        .set("Cookie", `bloom=${cookie}`);
      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual("test@gmail.com");
    });

    it("/auth/logout should logout successfully", async () => {
      const sessions = persist.getSessions();
      const cookie = sessions[2].key;
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", `bloom=${cookie}`);
      expect(response.status).toEqual(200);
      const updatedSessions = await persist.getSessions();
      expect(updatedSessions).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            email: "test@gmail.com",
          }),
        ])
      );
    });
  });

  describe("it should test /products", () => {
    it("/products should get all products", async () => {
      const response = await request(app).get("/products");
      expect(response.body).toEqual(products);
    });
  });

  describe("it should test /cart", () => {
    it("/cart should return 401 - no user", async () => {
      const response = await request(app).get("/cart");
      expect(response.status).toEqual(401);
    });

    it("/cart should get cart products", async () => {
      const response = await request(app)
        .get("/cart")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { ...products[1], id: carts[1].products[0].id },
      ]);
    });

    it("/card/add should add to cart", async () => {
      const response = await request(app)
        .put("/cart/add")
        .send({ productName: "Mixed Tulips" })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const updatedCart = persist.getCartByEmail("test-user@gmail.com");
      expect(updatedCart).toHaveLength(2);
    });

    it("/card/add should return 400 - invalid input", async () => {
      const response = await request(app)
        .put("/cart/add")
        .send({ product: "Mixed Tulips" })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(400);
    });

    it("/cart/remove should remove product from cart", async () => {
      const response = await request(app)
        .delete(`/cart/remove/${carts[1].products[0].id}`)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const updatedCart = persist.getCartByEmail("test-user@gmail.com");
      expect(updatedCart).toHaveLength(1);
    });

    it("/cart/remove should return 401 - invalid input", async () => {
      const response = await request(app)
        .delete(`/cart/remove`)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(401);
    });

    it("/cart/checkout should checkout with selected products", async () => {
      const cart = getCartByEmail("test-user@gmail.com");
      const response = await request(app)
        .post("/cart/checkout")
        .send({
          products: [cart[0].id],
          details: {
            address: "test",
            city: "test",
            cardNumber: "4242424242424242",
            cardExpirationDate: new Date(),
            cardCVV: "111",
          },
        })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const purchases = persist.getPurchases();
      expect(purchases).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: "test-user@gmail.com",
            products: [cart[0].name],
          }),
        ])
      );
    });

    it("/cart/checkout should return 400 - invalid input", async () => {
      const response = await request(app)
        .post("/cart/checkout")
        .send({
          details: {
            address: "test",
            city: "test",
          },
        })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(400);
    });
  });

  describe("it should test /gallery", () => {
    it("/gallery should return 401 if no user", async () => {
      const response = await request(app).get("/gallery");
      expect(response.status).toEqual(401);
    });

    it("/gallery should get gallery images", async () => {
      const response = await request(app)
        .get("/gallery")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(images);
    });

    it("/gallery/add should add an image to the gallery", async () => {
      const image = {
        img: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg",
        title: "This is a test image",
      };
      const response = await request(app)
        .put("/gallery/add")
        .send(image)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const updatedImages = persist.getGalleryImages();
      expect(updatedImages).toEqual(expect.arrayContaining([image]));
    });

    it("/gallery/add should return 400 - invalid input", async () => {
      const image = {
        title: "This is a test image",
      };
      const response = await request(app)
        .put("/gallery/add")
        .send(image)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(400);
    });
  });

  describe("it should test /club", () => {
    it("/club should return 401 if no user", async () => {
      const response = await request(app).get("/club");
      expect(response.status).toEqual(401);
    });

    it("/club/is-club-member should return if user is club member", async () => {
      const response = await request(app)
        .get("/club/is-club-member")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      expect(response.body.isClubMember).toEqual(false);
    });

    it("/club/join-the-club should add user to the club", async () => {
      const response = await request(app)
        .post("/club/join-the-club")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const users = persist.getUsers();
      expect(users).toEqual(
        expect.arrayContaining([expect.objectContaining({ club: true })])
      );
    });
  });

  describe("it should test /reviews", () => {
    it("/reviews should return 401 if no user", async () => {
      const response = await request(app).get("/reviews");
      expect(response.status).toEqual(401);
    });

    it("/reviews should get reviews", async () => {
      const response = await request(app)
        .get("/reviews")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(reviews);
    });

    it("/reviews/add should add a review", async () => {
      const review = {
        stars: 5,
        comment: "This is a test review",
        date: "2022-08-01T00:00:00.000Z",
      };
      const response = await request(app)
        .put("/reviews/add")
        .send(review)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
      const updatedReviews = persist.getReviews();
      expect(updatedReviews).toEqual(expect.arrayContaining([review]));
    });

    it("/reviews/add should return 400 - invalid input", async () => {
      const review = {
        comment: "This is a test review",
        date: "2022-08-01T00:00:00.000Z",
      };
      const response = await request(app)
        .put("/reviews/add")
        .send(review)
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(400);
    });
  });

  describe("it should test /contact-us", () => {
    it("/contact-us should return 401 if no user", async () => {
      const response = await request(app).post("/contact-us").send({
        subject: "Test subject",
        content: "Test content",
      });
      expect(response.status).toEqual(401);
    });

    it("/contact-us should send a contact us email", async () => {
      const response = await request(app)
        .post("/contact-us")
        .send({
          subject: "Test subject",
          content: "Test content",
        })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(200);
    });

    it("/contact-us should return 400 - invalid input", async () => {
      const response = await request(app)
        .post("/contact-us")
        .send({
          content: "Test content",
        })
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(400);
    });
  });

  describe("it should test /admin", () => {
    beforeEach(() => {
      fs.writeFileSync(
        ACTIVITIES_FILE,
        JSON.stringify({ activities: activities }, "utf8")
      );
    });

    it("/admin should return 401 if not admin", async () => {
      const response = await request(app)
        .get("/admin")
        .set("Cookie", `bloom=${USER_KEY}`);
      expect(response.status).toEqual(401);
    });

    it("/admin/activities should get user activities", async () => {
      const response = await request(app)
        .get("/admin/activities")
        .set("Cookie", `bloom=${ADMIN_KEY}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(activities);
    });

    it("/admin/add-product should add a product", async () => {
      const product = {
        name: "Sunny Daisy",
        description: "Yellow bouquet of Daisies",
        price: "70",
        image:
          "https://cdn.shopify.com/s/files/1/0507/3754/5401/t/1/assets/CGYD_ALT_V1_preset_proflowers-mx-hero-lv-alt.jpeg?v=1634324509",
      };
      const response = await request(app)
        .put("/admin/add-product")
        .send(product)
        .set("Cookie", `bloom=${ADMIN_KEY}`);
      expect(response.status).toEqual(200);
      const updatedProducts = persist.getProducts();
      expect(updatedProducts).toEqual(
        expect.arrayContaining([expect.objectContaining(product)])
      );
    });

    it("/admin/add-product should add a product - invalid input", async () => {
      const product = {
        name: "Sunny Daisy",
        description: "Yellow bouquet of Daisies",
        price: "70",
      };
      const response = await request(app)
        .put("/admin/add-product")
        .send(product)
        .set("Cookie", `bloom=${ADMIN_KEY}`);
      expect(response.status).toEqual(400);
    });

    it("/admin/remove-product should remove a product", async () => {
      const product = persist.getProductByName("Sunny Daisy");
      const id = product?.id;
      const response = await request(app)
        .delete(`/admin/remove-product/${id}`)
        .set("Cookie", `bloom=${ADMIN_KEY}`);
      expect(response.status).toEqual(200);
      const updatedProducts = persist.getProducts();
      const ids = updatedProducts.map((response) => response.id);
      expect(ids).not.toContain(id);
    });

    it("/admin/remove-product should return 401 - invalid input", async () => {
      const response = await request(app)
        .delete("/admin/remove-product/123")
        .set("Cookie", `bloom=${ADMIN_KEY}`);
      expect(response.status).toEqual(404);
    });
  });
});

function initiateMocks() {
  jest.spyOn(utils, "sendMail").mockImplementation(() => {
    return true;
  });
}

function initiateData() {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: [] }, "utf8"));
  fs.writeFileSync(
    PRODUCTS_FILE,
    JSON.stringify({ products: products }, "utf8")
  );
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: users }, "utf8"));
  fs.writeFileSync(
    SESSIONS_FILE,
    JSON.stringify({ sessions: sessions }, "utf8")
  );
  fs.writeFileSync(CARTS_FILE, JSON.stringify({ carts: carts }, "utf8"));
  fs.writeFileSync(PURCHASES_FILE, JSON.stringify({ purchases: [] }, "utf8"));
  fs.writeFileSync(
    ACTIVITIES_FILE,
    JSON.stringify({ activities: activities }, "utf8")
  );
  fs.writeFileSync(GALLERY_FILE, JSON.stringify({ images: images }, "utf8"));
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify({ reviews: reviews }, "utf8"));
}

function clearData() {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: [] }, "utf8"));
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({ products: [] }, "utf8"));
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, "utf8"));
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: [] }, "utf8"));
  fs.writeFileSync(CARTS_FILE, JSON.stringify({ carts: [] }, "utf8"));
  fs.writeFileSync(PURCHASES_FILE, JSON.stringify({ purchases: [] }, "utf8"));
  fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify({ activities: [] }, "utf8"));
  fs.writeFileSync(GALLERY_FILE, JSON.stringify({ images: [] }, "utf8"));
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify({ reviews: [] }, "utf8"));
}
