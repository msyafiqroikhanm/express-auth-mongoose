/* eslint-disable no-console */
const mongoose = require('mongoose');
const fs = require('fs');
const ACS_Modules = require('../models/acsModule');
const ACS_Features = require('../models/acsFeature');
const ACS_Roles = require('../models/acsRole');
const ACS_Role_Features = require('../models/acsRoleFeature');
const bcrypt = require('bcryptjs');
const ACS_Users = require('../models/acsUser');
require('dotenv').config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        //* Module
        const acs_modules = JSON.parse(
            fs.readFileSync('./seeders/data/acs_modules_parent.json')
        );
        const modules = acs_modules.map(element => ({
            name: element.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        await ACS_Modules.insertMany(modules);

        const parentModules = await ACS_Modules.find();
        const acs_modules_child = JSON.parse(
            fs.readFileSync('./seeders/data/acs_modules_child.json')
        );
        const childModules = acs_modules_child.map(element => {
            if (element.parentModuleId === 1) {
                return {
                    parentModuleId: parentModules[0]._id,
                    name: element.name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            } else {
                return {
                    parentModuleId: parentModules[1]._id,
                    name: element.name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            }
        });

        await ACS_Modules.insertMany(childModules);
        console.log('ACS_Modules seeded successfully.');

        //* Feature
        const base_features = ['Create', 'Read', 'Update', 'Delete'];
        const existingModules = await ACS_Modules.find({
            parentModuleId: { $ne: null },
        });
        const features = [];
        existingModules.forEach(module => {
            base_features.forEach(feature => {
                features.push({
                    moduleId: module.id,
                    name: `${feature} ${module.name}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            });
        });
        await ACS_Features.insertMany(features);
        console.log('ACS_Features seeded successfully.');

        //* Role
        const acs_roles = JSON.parse(
            fs.readFileSync('./seeders/data/acs_roles.json')
        );
        const roles = acs_roles.map(element => ({
            name: element.name,
            isAdministrative: element.isAdministrative,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        await ACS_Roles.insertMany(roles);
        console.log('ACS_Roles seeded successfully.');

        //* RoleFeatures
        const adminRole = await ACS_Roles.findOne({ isAdministrative: true });
        const qcRole = await ACS_Roles.findOne({ isAdministrative: false });
        const ktpModules = await ACS_Modules.findOne({ name: 'KTP Checker' });
        const ktpChildModules = await ACS_Modules.find({
            parentModuleId: ktpModules._id,
        });
        const ktpModuleIds = ktpChildModules.map(module => module._id);
        const ktpFeatures = await ACS_Features.find({
            moduleId: { $in: ktpModuleIds },
        });
        const allFeatures = await ACS_Features.find();
        const ktpFeatureIds = ktpFeatures.map(feature => feature._id);
        const allFeatureIds = allFeatures.map(feature => feature._id);

        const roleFeatures = [];
        allFeatureIds.forEach(featureId => {
            roleFeatures.push({
                roleId: adminRole._id,
                featureId: featureId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });
        ktpFeatureIds.forEach(featureId => {
            roleFeatures.push({
                roleId: qcRole._id,
                featureId: featureId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });
        await ACS_Role_Features.insertMany(roleFeatures);
        console.log('ACS_Role_Features seeded successfully.');

        // * User
        const acs_users = JSON.parse(
            fs.readFileSync('./seeders/data/acs_users.json')
        );
        const defaultSaltNumber = 10;
        const salt = bcrypt.genSaltSync(defaultSaltNumber);
        const defaultPassword = bcrypt.hashSync('P4ssword', salt);
        const users = [
            {
                name: 'Administrator',
                email: 'id_dev@kadence.com',
                password: defaultPassword,
                salt,
                roleId: adminRole._id,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        acs_users.forEach(element => {
            users.push({
                name: element.name,
                email: element.email,
                password: defaultPassword,
                salt,
                roleId: qcRole._id,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        await ACS_Users.insertMany(users);

        console.log('===============================');
        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
