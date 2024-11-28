const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const categoryController = require("../../controllers/dashboard/categoryController");

router.post("/category-add", authMiddleware, categoryController.add_category);
router.get("/category-get", authMiddleware, categoryController.get_category);
router.get(
  "/get-one-category/:categoryId",
  authMiddleware,
  categoryController.get_one_category
);
router.delete(
  "/category-delete/:categoryId",
  authMiddleware,
  categoryController.delete_category
);
router.post(
  "/category-update",
  authMiddleware,
  categoryController.category_update
);
router.post(
  "/category-image-update",
  authMiddleware,
  categoryController.category_image_update
);

module.exports = router;
