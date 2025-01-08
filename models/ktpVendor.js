const mongoose = require('mongoose');
const { ENUM_VENDOR_TYPES } = require('../libraries/ktp.lib');

const ktpVendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ENUM_VENDOR_TYPES,
            required: true,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

ktpVendorSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});
ktpVendorSchema.pre(/^count/, function (next) {
    this.where({ deletedAt: null });
    next();
});

const KTP_Vendors = mongoose.model(
    'KTP_Vendors',
    ktpVendorSchema,
    'KTP_Vendors'
);
module.exports = KTP_Vendors;
