const categoryModel = require("../../models/categoryModel");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const formidable = require("formidable");
const subCategory = require("../../models/subCategory");
const productModel = require("../../models/productModel");
const mongoose = require("mongoose");
class categoryController {
  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "something error" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name.trim();

        const slug = name.split(" ").join("-");
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });
        try {
          // Define the transformation parameters for cropping
          const cropParams = {
            width: 300,
            height: 300,
            crop: "crop", // Use 'crop' to perform cropping
            gravity: "auto", // Use 'auto' to automatically detect the most relevant region
          };
          // Upload the cropped image to Cloudinary
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
            resource_type: "image",
            transformation: cropParams,
          });
          // console.log(result, "result");
          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "category add success",
            });
          } else {
            responseReturn(res, 404, { error: "Image upload failed" });
          }
        } catch (error) {
          console.log(error);
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else if (searchValue === "" && page && parPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  get_one_category = async (req, res) => {
    const { categoryId } = req.params;

    try {
      const category = await categoryModel.findById(categoryId);
      responseReturn(res, 200, { category });
    } catch (error) {
      console.log(error.message);
    }
  };

  //delete category
  delete_category = async (req, res) => {
    const { categoryId } = req.params;
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin the transaction

    try {
      // ___________________________________WORK PENDING HERE _________________

      // const myCategory = await categoryModel.findById()
      // 1. Delete the main category
      const category = await categoryModel.findByIdAndDelete(categoryId, {
        session,
      });
      // console.log("category", category);
      if (!category) {
        throw new Error("Category not found");
      }

      const subcategoryList = await subCategory.find({ categoryId });
      // 2. Delete the subcategories associated with the category
      const subcategories = await subCategory.deleteMany(
        { categoryId },
        { session }
      );
      console.log(subcategoryList);
      // 3. Delete the products associated with the category and its subcategories
      console.log("firedd.....");
      const productDeletion = await productModel.deleteMany(
        {
          $or: [
            { category: category.name }, // Products directly in the category
            { subcategory: { $in: subcategoryList.map((sub) => sub.name) } }, // Products in subcategories
          ],
        },
        { session }
      );

      console.log(productDeletion);

      console.log("fireddd.. 2");
      // Commit the transaction if everything went well
      await session.commitTransaction();
      session.endSession();

      // await categoryModel.findByIdAndDelete(categoryId);

      responseReturn(res, 200, {
        message: "Category deleted successfully",
        categoryId,
      });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { message: error.message });
    }
  };

  category_update = async (req, res) => {
    let { name, image, categoryId } = req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await productModel.findByIdAndUpdate(categoryId, {
        name,
        categoryId,
        slug,
      });

      const category = await categoryModel.findById(categoryId);
      responseReturn(res, 200, {
        category,
        message: "category update success",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  category_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { categoryId, oldImage } = field;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
         
          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "categorys",
          });
          if (result) {
            let { images } = await categoryModel.findById(categoryId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;

            await categoryModel.findByIdAndUpdate(categoryId, {
              images,
            });

            const category = await categoryModel.findById(categoryId);
            responseReturn(res, 200, {
              category,
              message: "category image update success",
            });
          } else {
            responseReturn(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };
}

module.exports = new categoryController();
