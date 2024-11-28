const { Schema, model } = require("mongoose");

const BannerSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      // required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("banner", BannerSchema);
