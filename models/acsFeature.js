const mongoose = require("mongoose");

const acsFeatureSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ACS_Modules",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ACS_Features = mongoose.model(
  "ACS_Features",
  acsFeatureSchema,
  "ACS_Features"
);
module.exports = ACS_Features;
