const bannerModal = require("../../models/bannerModel");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../../utiles/response");
const formidable = require("formidable");

class bannerController {
  add_banner = async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "something error" });
      } else {
        let { heading } = fields;
        let { description } = fields;
        let { path } = files;
        let { buttonText } = fields;

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const cropParams = {
            width: 300,
            height: 300,
            crop: "crop",
            gravity: "auto",
          };

          // Upload the cropped image to Cloudinary
          const result = await cloudinary.uploader.upload(path.filepath, {
            folder: "banner",
            resource_type: "image",
            transformation: cropParams,
          });

          if (result) {
            const banner = await bannerModal.create({
              heading,
              description,
              path: result.url,
              buttonText,
            });
            responseReturn(res, 201, {
              banner,
              message: "Banner Created Successfully",
            });
          } else {
            responseReturn(res, 404, { error: "Image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  get_banner_Items = async (req, res) => {
    const { page, searchValue, parPage } = req.query;

    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && parPage) {
        const banners = await bannerModal
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalBanners = await bannerModal
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { totalBanners, banners });
      } else if (searchValue === "" && page && parPage) {
        const banners = await bannerModal
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalBanners = await bannerModal.find({}).countDocuments();
        responseReturn(res, 200, { totalBanners, banners });
      } else {
        const banners = await bannerModal.find({}).sort({ createdAt: -1 });
        const totalBanners = await bannerModal.find({}).countDocuments();
        responseReturn(res, 200, { totalBanners, banners });
      }
    } catch (error) {
      console.log(error, "errorData");

      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}
module.exports = new bannerController();
