const mongoose = require("mongoose");

const acsRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isAdministrative: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ACS_Roles = mongoose.model("ACS_Roles", acsRoleSchema, "ACS_Roles");
module.exports = ACS_Roles;
