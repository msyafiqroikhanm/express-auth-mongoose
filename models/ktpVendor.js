var mongoose = require("mongoose");

var vendorTypes = ["INTERNAL", "EXTERNAL"];

var ktpVendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: vendorTypes,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

var KTP_Vendors = mongoose.model("KTP_Vendors", ktpVendorSchema);
module.exports = KTP_Vendors;
