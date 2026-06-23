const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const { RedisStore } = require("connect-redis"); // or { RedisStore } depending on your version

const cors = require("cors"); // <-- 1. NEW: Import cors

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_URL || "redis",
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

app.enable("trust proxy");

// 2. NEW: Enable CORS for all routes
app.use(cors({}));

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || "my_super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  }),
);

app.use(express.json());

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@mongo:27017/?authSource=admin`;

mongoose
  .connect(mongoURL)
  .then(() => console.log("Successfully Connected to MongoDB!"))
  .catch((e) => console.log(e));

// 3. NEW: Add a console.log to test load balancing
app.get("/api/v1", (req, res) => {
  res.send("<h2>Hello from the Node API! May GitHub Actions runs successfullys</h2>");
  console.log("Yeah it ran"); // This helps prove Nginx is balancing traffic
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
