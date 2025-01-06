/* eslint-disable no-param-reassign */
const ACS_Roles = require("../models/acsRole");
const { default: mongoose } = require("mongoose");
const ACS_Modules = require("../models/acsModule");
const ACS_Features = require("../models/acsFeature");
const ACS_RoleFeatures = require("../models/acsRoleFeature");
const ACS_Users = require("../models/acsUser");

const selectAllRoles = async () => {
  const data = await ACS_Roles.aggregate([
    // Join with RoleFeatures
    {
      $lookup: {
        from: "ACS_RoleFeatures",
        localField: "_id",
        foreignField: "roleId",
        as: "roleFeatures",
      },
    },

    // Join RoleFeatures with Features
    {
      $lookup: {
        from: "ACS_Features",
        localField: "roleFeatures.featureId",
        foreignField: "_id",
        as: "features",
      },
    },

    {
      $project: {
        name: "$name",
        isAdministrative: "$isAdministrative",
        features: {
          $map: {
            input: "$features",
            as: "feature",
            in: {
              id: "$$feature._id",
              name: "$$feature.name",
            },
          },
        },
      },
    },
  ]);

  return {
    success: true,
    message: "Successfully Getting All Roles",
    content: data,
  };
};

const selectRole = async (id) => {
  const roleInstance = await ACS_Roles.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },

    // Join with RoleFeatures
    {
      $lookup: {
        from: "ACS_RoleFeatures",
        localField: "_id",
        foreignField: "roleId",
        as: "roleFeatures",
      },
    },

    // Join RoleFeatures with Features
    {
      $lookup: {
        from: "ACS_Features",
        localField: "roleFeatures.featureId",
        foreignField: "_id",
        as: "features",
      },
    },

    // Join Features with Modules
    {
      $lookup: {
        from: "ACS_Modules",
        localField: "features.moduleId",
        foreignField: "_id",
        as: "modules",
      },
    },
  ]);

  if (!roleInstance.length) {
    return {
      success: false,
      message: ["Role Not Found"],
    };
  }

  const parentModules = await ACS_Modules.find({ parentModuleId: null });
  const parentModuleReduced = parentModules.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.name;
    return acc;
  }, {});

  const modules = [];
  roleInstance[0].roleFeatures.forEach((roleFeature) => {
    const feature = roleInstance[0].features.find(
      (f) => f._id.toString() === roleFeature.featureId.toString()
    );
    const module = roleInstance[0].modules.find(
      (m) => m._id.toString() === feature.moduleId.toString()
    );

    if (!modules.find((m) => m._id === module._id)) {
      modules.push({
        _id: module._id,
        name: module.name,
        parentModule: parentModuleReduced[module.parentModuleId],
        features: [],
      });
    } else {
      const currentModule = modules.find((m) => m._id === module._id);
      currentModule.features.push({
        _id: feature._id,
        name: feature.name,
      });
    }
  });

  return {
    success: true,
    message: "Success Getting Role",
    content: {
      _id: roleInstance[0]._id,
      name: roleInstance[0].name,
      isAdministrative: roleInstance[0].isAdministrative,
      modules,
    },
  };
};

const validateRoleInputs = async (form, id) => {
  const invalid400 = [];
  const invalid404 = [];

  console.log(form);
  const validFeatures = await ACS_Features.find({
    _id: { $in: form.features },
  });
  if (validFeatures.length !== form.features.length) {
    invalid404.push("Feature Not Found");
  }

  // check role name duplicate
  const duplicateRole = await ACS_Roles.findOne(
    id ? { _id: { $ne: id }, name: form.name } : { name: form.name }
  );
  if (duplicateRole) {
    invalid400.push("Role Name Already Taken / Exist");
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

  let isAdministrative;
  if (typeof form.isAdministrative === "boolean") {
    isAdministrative = form.isAdministrative;
  } else {
    isAdministrative = form.isAdministrative?.toLowerCase() === "true";
  }

  return {
    isValid: true,
    form: {
      name: form.name,
      features: validFeatures,
      isAdministrative,
    },
  };
};

const createRole = async (form) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const roleInstance = await ACS_Roles.create(
      [
        {
          name: form.name,
          isAdministrative: form.isAdministrative,
        },
      ],
      { session }
    );

    const roleFeatures = form.features.map((feature) => ({
      roleId: roleInstance[0]._id,
      featureId: feature,
    }));

    await ACS_RoleFeatures.insertMany(roleFeatures, { session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Role Successfully Created",
      content: roleInstance[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      succcess: false,
      code: 500,
      message: ["Internal Server Error"],
    };
  }
};

const updateRole = async (id, form) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const roleInstance = await ACS_Roles.findById(id);
    if (!roleInstance) {
      const error = {
        succcess: false,
        code: 404,
        message: ["Role Data Not Found"],
      };
      return error;
    }

    await ACS_Roles.updateOne({ _id: id }, form, { session });

    await ACS_RoleFeatures.deleteMany(
      { roleId: roleInstance._id },
      { session }
    );

    const roleFeatures = form.features.map((feature) => ({
      roleId: roleInstance._id,
      featureId: feature,
    }));

    await ACS_RoleFeatures.insertMany(roleFeatures, { session });

    return {
      succcess: true,
      message: "Role Successfully Updated",
      content: roleInstance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return {
      succcess: false,
      code: 500,
      message: ["Internal Server Error"],
    };
  }
};

const deleteRole = async (id) => {
  // validate role id
  const roleInstance = await ACS_Roles.findById(id);
  if (!roleInstance) {
    const error = {
      succcess: false,
      code: 404,
      message: ["Role Data Not Found"],
    };
    return error;
  }

  const users = await ACS_Users.find({ roleId: id });
  if (users.length > 0) {
    return {
      success: false,
      code: 400,
      message: ["Role Cannot Be Deleted, Role Still Used By User"],
    };
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await ACS_RoleFeatures.deleteMany({ roleId: id }, { session });
    await ACS_Roles.deleteOne({ _id: id }, { session });

    return {
      success: true,
      message: "Role Successfully Deleted",
      content: `Role ${roleInstance.name} Successfully Deleted`,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return {
      succcess: false,
      code: 500,
      message: ["Internal Server Error"],
    };
  }
};

module.exports = {
  validateRoleInputs,
  selectAllRoles,
  selectRole,
  createRole,
  updateRole,
  deleteRole,
};
