const mongoose = require('mongoose');

const ktpRespondentsSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'KTP_Projects',
            required: true,
            index: true,
        },
        identityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'KTP_Identities',
            required: true,
            index: true,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'KTP_Vendors',
            required: true,
            index: true,
        },
        visitDate: {
            type: Date,
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USR_Users',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

const KTP_Respondents = mongoose.model(
    'KTP_Respondents',
    ktpRespondentsSchema,
    'KTP_Respondents'
);

module.exports = KTP_Respondents;
