/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */

const { parse } = require("path");
const ACS_Users = require("../models/acsUser");
const mongoose = require("mongoose");
const ACS_Modules = require("../models/acsModule");
const { parsingUserModules } = require("../helpers/parsing.helper");
const ACS_Roles = require("../models/acsRole");
const bcrypt = require("bcryptjs");

const filterNotDeleted = { deletedAt: null };

const selectUser = async (query) => {
  const userInstance = await ACS_Users.findOne()
    .populate({
      path: "roleId",
      select: ["name", "isAdministrative"],
    })
    .or(query);
  if (!userInstance) {
    return null;
  }

  return userInstance;
};

const updateLastLoginUser = async (id) => {
  await ACS_Users.updateOne({ _id: id }, { lastLogin: new Date() });
};

const getAccessUserById = async (userId) => {
  const result = await ACS_Users.aggregate([
    // Match User by userId
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },

    // Join with Role
    {
      $lookup: {
        from: "ACS_Roles",
        localField: "roleId",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },

    // Join with RoleFeatures
    {
      $lookup: {
        from: "ACS_RoleFeatures",
        localField: "role._id",
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

    // Project all data
    {
      $project: {
        userId: "$_id",
        userName: "$name",
        userEmail: "$email",
        role: "$role",
        roleFeatures: "$roleFeatures",
        features: "$features",
        modules: "$modules",
      },
    },

    { $limit: 1 },
  ]);

  if (!result.length) {
    return null;
  }

  const parentModules = await ACS_Modules.find({ parentModuleId: null });
  const parentModuleReduced = parentModules.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.name;
    return acc;
  }, {});

  // Transform data
  const userData = result.map((user) => {
    const roleFeatures = user.roleFeatures.map((roleFeature) => {
      const feature = user.features.find(
        (f) => f._id.toString() === roleFeature.featureId.toString()
      );
      const module = user.modules.find(
        (m) => m._id.toString() === feature.moduleId.toString()
      );

      return {
        feature: {
          _id: feature._id,
          name: feature.name,
          module: {
            _id: module._id,
            name: module.name,
            parentModule: module.parentModuleId
              ? {
                  id: module.parentModuleId,
                  name: parentModuleReduced[module.parentModuleId],
                }
              : null,
          },
        },
      };
    });

    return {
      _id: user.userId,
      name: user.userName,
      email: user.userEmail,
      role: {
        _id: user.role._id,
        name: user.role.name,
        isAdministrative: user.role.isAdministrative,
        roleFeatures: roleFeatures,
      },
    };
  });

  const modules = parsingUserModules(userData[0]);
  userData[0].modules = modules;
  return userData[0];
};

const selectAllUsers = async (query) => {
  const users = await ACS_Users.aggregate([
    { $match: { ...query, ...filterNotDeleted } },
    {
      $lookup: {
        from: "ACS_Roles",
        localField: "roleId",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        isActive: 1,
        role: {
          _id: 1,
          name: 1,
          isAdministrative: 1,
        },
      },
    },
  ]);
  return {
    success: true,
    message: "Successfully Getting All Users",
    content: users,
  };
};

const selectDetailUser = async (id) => {
  const users = await ACS_Users.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id), ...filterNotDeleted } },
    {
      $lookup: {
        from: "ACS_Roles",
        localField: "roleId",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        isActive: 1,
        role: {
          _id: 1,
          name: 1,
          isAdministrative: 1,
        },
      },
    },
    { $limit: 1 },
  ]);

  if (!users.length) {
    return {
      success: false,
      message: ["User Not Found"],
    };
  }

  return {
    success: true,
    message: "Successfully Getting User Data",
    content: users[0],
  };
};

const validateUserInputs = async (form, id) => {
  const invalid404 = [];
  const invalid400 = [];

  const role = await ACS_Roles.findById(form.roleId);
  if (!role) {
    invalid404.push("Role Data Not Found");
  }

  if (invalid404.length) {
    return {
      success: false,
      code: 404,
      message: invalid404,
    };
  }

  const isNotUniqueEmail = await ACS_Users.findOne(
    id
      ? { _id: { $ne: new mongoose.Types.ObjectId(id) }, email: form.email }
      : { email: form.email }
  );
  if (isNotUniqueEmail) {
    invalid400.push("Email Already Registered");
  }

  if (invalid400.length) {
    return {
      success: false,
      code: 400,
      message: invalid400,
    };
  }

  return {
    isValid: true,
    form: {
      roleId: form.roleId,
      name: form.name,
      email: form.email,
      password: form.password,
    },
  };
};

const createUser = async (form) => {
  form.salt = bcrypt.genSaltSync(10);
  form.password = bcrypt.hashSync(form.password, form.salt);
  form.isActive = true;
  const user = await ACS_Users.create(form);

  return {
    success: true,
    message: "User Successfully Created",
    content: {
      _id: user._id,
      user: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  };
};

const updateUser = async (id, form) => {
  const user = await ACS_Users.findById(id);
  if (!user) {
    return {
      success: false,
      code: 404,
      message: ["User Not Found"],
    };
  }

  user.name = form.name;
  user.email = form.email;
  user.roleId = form.roleId;
  await user.save();

  return {
    success: true,
    message: "User Successfully Updated",
    content: {
      _id: user._id,
      user: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  };
};

const deleteUser = async (id) => {
  const user = await ACS_Users.findById(id);
  if (!user) {
    return {
      success: false,
      code: 404,
      message: ["User Not Found"],
    };
  }

  // soft delete
  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  return {
    success: true,
    code: 200,
    message: "User Successfully Deleted",
  };
};

const validatePasswordInputs = async (id, form) => {
  // check validity of user id
  const invalid404 = [];
  const invalid400 = [];
  const userInstance = await ACS_Users.findById(id);
  if (!userInstance) {
    invalid404.push("User Data Not Found");
  }

  if (form.newPassword !== form.newRePassword) {
    invalid400.push("New Password and New Re-Password Do Not Match");
  }

  const comparePassword = bcrypt.compareSync(
    form.oldPassword,
    userInstance?.password
  );
  if (!comparePassword) {
    invalid400.push("Old password is incorrect");
  }

  if (form.oldPassword === form.newPassword) {
    invalid400.push("New Password Cannot Be Same As Old Password");
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

  return {
    isValid: true,
    form: {
      user: userInstance,
      newPassword: form.newPassword,
      newRePassword: form.newRePassword,
    },
  };
};

const validateResetPassword = async (form, id) => {
  // check validity of user id
  const invalid404 = [];
  const invalid400 = [];
  const userInstance = await ACS_Users.findById(id);
  if (!userInstance) {
    invalid404.push("User Data Not Found");
  }

  if (form.newPassword !== form.newRePassword) {
    invalid400.push("New Password and New Re-Password Do Not Match");
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

  return {
    isValid: true,
    form: {
      user: userInstance,
      newPassword: form.newPassword,
      newRePassword: form.newRePassword,
    },
  };
};

const updateUserPassword = async (form) => {
  form.user.salt = bcrypt.genSaltSync(10);
  form.user.password = bcrypt.hashSync(form.newPassword, form.user.salt);
  await form.user.save();

  return {
    success: true,
    message: "Successfully Reset Password",
  };
};

module.exports = {
  selectUser,
  updateLastLoginUser,
  getAccessUserById,
  selectAllUsers,
  selectDetailUser,
  validateUserInputs,
  createUser,
  updateUser,
  deleteUser,
  validatePasswordInputs,
  updateUserPassword,
  validateResetPassword,
};
