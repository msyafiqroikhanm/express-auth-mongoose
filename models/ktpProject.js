const mongoose = require('mongoose');

const departments = ['QUANTITATIVE', 'QUALITATIVE'];

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

const KTP_Projects = mongoose.model('KTP_Projects', ktpProjectSchema);
module.exports = KTP_Projects;
