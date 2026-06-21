const express = require("express");
const postController = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for the base URL (/api/v1/posts)
router
  .route("/")
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

// Routes that require a specific ID parameter (/api/v1/posts/:id)
router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
