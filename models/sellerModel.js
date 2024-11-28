const { Schema, model } = require("mongoose");

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "seller",
    },
    status: {
      type: String,
      default: "pending",
    },
    shopInfo: {
      shopName: { type: String, required: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  sub_district: { type: String, required: true },
    },
    otp: {
      type: Number,
      default: null,
    },
    payment: {
      type: String,
      default: "inactive",
    },
    method: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },

    businessName: {
      type: String,
      default: "",
    },
    pan: {
      type: String,
      default: "",
    },

    doc: {
      type: Array,
      default: [],
    },
    adhaar: {
      type: String,
      default: "",
    },
    businessAddress: {
      type: String,
      default: "",
    },
    isBasic: {
      type: Boolean,
      default: false,
    },
    pincode: {
      type: String,
      default: "",
    },
    gst: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
      required: false,
    },
    subCategory: {
      type: String,
      default: "",
      required: false,
    },
  },
  { timestamps: true }
);

sellerSchema.index(
  {
    name: "text",
    email: "text",
  },
  {
    weights: {
      name: 5,
      email: 4,
    },
  }
);



module.exports = model("sellers", sellerSchema);
