const router = require("express").Router();
const {authMiddleware} = require("../../middlewares/authMiddleware");
const bannerController = require("../../controllers/dashboard/bannerController")

router.post("/createbanner",authMiddleware,bannerController.add_banner);
router.get("/getallbannerItems",authMiddleware,bannerController.get_banner_Items)

module.exports = router;