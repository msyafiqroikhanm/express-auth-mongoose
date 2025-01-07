const mongoose = require('mongoose');

const acsUserSchema = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ACS_Roles',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

acsUserSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});

const ACS_Users = mongoose.model('ACS_Users', acsUserSchema, 'ACS_Users');
module.exports = ACS_Users;
