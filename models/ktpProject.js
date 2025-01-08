const mongoose = require('mongoose');
const { ENUM_DEPARTMENTS } = require('../libraries/ktp.lib');

const ktpProjectSchema = new mongoose.Schema(
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
            enum: ENUM_DEPARTMENTS,
            required: true,
            index: true,
        },
        study: {
            type: String,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

ktpProjectSchema.index({ projectId: 1, department: 1, study: 1, isActive: 1 });

ktpProjectSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});
ktpProjectSchema.pre(/^count/, function (next) {
    this.where({ deletedAt: null });
    next();
});

const KTP_Projects = mongoose.model(
    'KTP_Projects',
    ktpProjectSchema,
    'KTP_Projects'
);
module.exports = KTP_Projects;
