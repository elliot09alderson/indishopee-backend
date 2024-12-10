const router = require("express").Router();
const cardController = require("../../controllers/home/cardController");
const { customerMiddleware } = require("../../middlewares/authMiddleware");

router.post(
  "/home/product/add-to-card",
  customerMiddleware,
  cardController.add_to_card
);
router.get(
  "/home/product/get-card-product",
  customerMiddleware,
  cardController.get_card_products
);
router.delete(
  "/home/product/delete-all-cart-product/:userId",
  customerMiddleware,
  cardController.delete_all_card_product
);
router.delete(
  "/home/product/delete-card-product/:card_id",
  cardController.delete_card_product
);
router.put("/home/product/quantity-inc/:card_id", cardController.quantity_inc);
router.put("/home/product/quantity-dec/:card_id", cardController.quantity_dec);

router.post(
  "/home/product/add-to-wishlist",
  customerMiddleware,
  cardController.add_wishlist
);
router.get(
  "/home/product/get-wishlist-products",
  customerMiddleware,
  cardController.get_wishlist
);
router.delete(
  "/home/product/delete-wishlist-product/:wishlistId",
  customerMiddleware,
  cardController.delete_wishlist
);

module.exports = router;
