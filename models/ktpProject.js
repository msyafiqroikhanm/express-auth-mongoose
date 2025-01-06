var mongoose = require("mongoose");

var departments = ["QUANTITATIVE", "QUALITATIVE"];

var ktpProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: departments,
      required: true,
    },
    study: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

var KTP_Projects = mongoose.model("KTP_Projects", ktpProjectSchema);
module.exports = KTP_Projects;
