const mongoose = require('mongoose');

const vendorTypes = ['INTERNAL', 'EXTERNAL'];

const ktpVendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: vendorTypes,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const KTP_Vendors = mongoose.model('KTP_Vendors', ktpVendorSchema);
module.exports = KTP_Vendors;
