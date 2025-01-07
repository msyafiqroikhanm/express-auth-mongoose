const mongoose = require('mongoose');

const acsRoleFeatureSchema = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ACS_Roles',
            required: true,
        },
        featureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ACS_Features',
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const ACS_RoleFeatures = mongoose.model(
    'ACS_RoleFeatures',
    acsRoleFeatureSchema,
    'ACS_RoleFeatures'
);
module.exports = ACS_RoleFeatures;
