/* eslint-disable no-param-reassign */
const ACS_Features = require("../models/acsFeature");
const { default: mongoose } = require("mongoose");
const ACS_Modules = require("../models/acsModule");
const ACS_RoleFeatures = require("../models/acsRoleFeature");

const selectAllFeatures = async (condition) => {
  const features = await ACS_Features.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "ACS_Modules",
        localField: "moduleId",
        foreignField: "_id",
        as: "module",
      },
    },
    { $unwind: "$module" },
    {
      $project: {
        _id: 1,
        name: 1,
        moduleId: 1,
        module: "$module.name",
      },
    },
  ]);

  return {
    success: true,
    message: "Succesfully Getting All Feature",
    content: features,
  };
};

const selectFeature = async (id) => {
  // validate feature id
  const featureInstance = await ACS_Features.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "ACS_Modules",
        localField: "moduleId",
        foreignField: "_id",
        as: "module",
      },
    },
    { $unwind: "$module" },
    {
      $project: {
        _id: 1,
        name: 1,
        moduleId: 1,
        module: "$module.name",
      },
    },
    { $limit: 1 },
  ]);
  if (!featureInstance) {
    const error = {
      success: false,
      code: 404,
      message: ["Feature Data Not Found"],
    };
    return error;
  }

  return {
    success: true,
    message: "Succesfully Getting Feature",
    content: featureInstance[0],
  };
};

const createFeature = async (form) => {
  try {
    const featureInstance = await ACS_Features.create(form);

    return {
      success: true,
      message: "Feature Successfully Created",
      content: featureInstance,
    };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const validateFeatureInputs = async (form, id) => {
  const { moduleId, name } = form;

  const invalid400 = [];
  const invalid404 = [];

  // check module name duplicate
  const duplicateModule = await ACS_Features.findOne(
    id
      ? { _id: { $ne: new mongoose.Types.ObjectId(id) }, name: form.name }
      : { name: form.name }
  );
  console.log(duplicateModule);
  if (duplicateModule) {
    invalid400.push("Feature Name Already Taken / Exist");
  }

  // validate module id
  const moduleInstance = await ACS_Modules.findById(moduleId);
  if (!moduleInstance) {
    invalid404.push("Module Data Not Found");
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  return { isValid: true, form: { moduleId, name } };
};

const updateFeature = async (id, form) => {
  try {
    // validate feature id
    const featureInstance = await ACS_Features.findById(id);
    if (!featureInstance) {
      return { success: false, code: 404, message: ["Feature Data Not Found"] };
    }

    // update instance with new data
    featureInstance.name = form.name;
    featureInstance.moduleId = form.moduleId;
    await featureInstance.save();

    return {
      success: true,
      message: "Feature Successfully Updated",
      content: featureInstance,
    };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const deleteFeature = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate feature id
    const featureInstance = await ACS_Features.findById(id).session(session);
    if (!featureInstance) {
      return {
        success: false,
        code: 404,
        message: ["Feature Data Not Found"],
      };
    }

    const { name } = featureInstance;

    // Delete feature
    await ACS_Features.deleteOne({ _id: id }).session(session);

    // Delete related role features
    await ACS_RoleFeatures.deleteMany({
      featureId: new mongoose.Types.ObjectId(id),
    }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Feature Successfully Deleted",
      content: `Feature ${name} Successfully Deleted`,
    };
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();
    return error;
  }
};

module.exports = {
  selectAllFeatures,
  validateFeatureInputs,
  selectFeature,
  createFeature,
  updateFeature,
  deleteFeature,
};
