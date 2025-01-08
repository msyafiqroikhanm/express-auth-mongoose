const mongoose = require('mongoose');
const { ENUM_IDENTITY_TYPES } = require('../libraries/ktp.lib');

const ktpIdentitiesSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ENUM_IDENTITY_TYPES,
            required: true,
            index: true,
        },
        identityNbr: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        phoneNbr: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ACS_Users',
            required: true,
        },
    },
    { timestamps: true }
);

const KTP_Identities = mongoose.model(
    'KTP_Identities',
    ktpIdentitiesSchema,
    'KTP_Identities'
);

module.exports = KTP_Identities;
