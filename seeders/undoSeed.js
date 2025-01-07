/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const ACS_Features = require('../models/acsFeature');
const ACS_Modules = require('../models/acsModule');
const ACS_Roles = require('../models/acsRole');
const ACS_RoleFeatures = require('../models/acsRoleFeature');
const ACS_Users = require('../models/acsUser');
require('dotenv').config();

async function undoSeeding() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        await ACS_Modules.deleteMany({});
        console.log('ACS_Modules undone successfully.');
        await ACS_Features.deleteMany({});
        console.log('ACS_Features undone successfully.');
        await ACS_Roles.deleteMany({});
        console.log('ACS_Roles undone successfully.');
        await ACS_RoleFeatures.deleteMany({});
        console.log('ACS_RoleFeatures undone successfully.');
        await ACS_Users.deleteMany({});
        console.log('ACS_Users undone successfully.');

        console.log('===============================');
        console.log('Undo seeding successfully.');
        return;
    } catch (error) {
        console.error(error);
    }
}

undoSeeding();
