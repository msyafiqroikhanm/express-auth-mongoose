const mongoose = require("mongoose");

const acsModuleSchema = new mongoose.Schema(
  {
    parentModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ACS_Modules",
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

const ACS_Modules = mongoose.model(
  "ACS_Modules",
  acsModuleSchema,
  "ACS_Modules"
);
module.exports = ACS_Modules;
