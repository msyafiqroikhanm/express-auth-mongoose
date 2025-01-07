const ACS_Modules = require('../models/acsModule');
const { default: mongoose } = require('mongoose');
const ACS_Features = require('../models/acsFeature');
const ACS_RoleFeatures = require('../models/acsRoleFeature');

const validateModuleQuery = async query => {
    const parsedQuery = {};

    if (query.type) {
        parsedQuery.type = query.type.toLowerCase();
    }

    return parsedQuery;
};

const selectAllModules = async query => {
    const modules = await ACS_Modules.find(
        {},
        { createdAt: 0, updatedAt: 0, __v: 0 }
    );

    const data = { mainModule: [], subModule: [] };
    modules.forEach(module => {
        if (module.parentModuleId) {
            data.subModule.push(module);
        } else {
            data.mainModule.push(module);
        }
    });

    let parsedData = data;
    if (query?.type === 'mainmodule') {
        parsedData = data.mainModule;
    } else if (query?.type === 'submodule') {
        parsedData = data.subModule;
    }

    return {
        success: true,
        message: 'Successfully Getting All Module',
        content: parsedData,
    };
};

const selectModule = async id => {
    // validate module id
    const moduleInstance = await ACS_Modules.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'ACS_Modules',
                localField: 'parentModuleId',
                foreignField: '_id',
                as: 'parentModule',
            },
        },
        { $limit: 1 },
        {
            $project: {
                _id: 1,
                name: 1,
                parentModule: {
                    $ifNull: [
                        { $arrayElemAt: ['$parentModule.name', 0] },
                        null,
                    ],
                },
            },
        },
    ]);

    if (!moduleInstance) {
        const error = {
            success: false,
            code: 404,
            message: ['Module Data Not Found'],
        };
        return error;
    }

    return {
        success: true,
        message: 'Successfully Getting Module Data',
        content: moduleInstance[0],
    };
};

const createMainModule = async form => {
    try {
        // check module name duplicate
        const duplicateModule = await ACS_Modules.findOne({ name: form.name });
        if (duplicateModule) {
            return {
                success: false,
                code: 400,
                message: ['Module Name Already Taken / Exist'],
            };
        }
        const moduleInstance = await ACS_Modules.create(form);
        return {
            success: true,
            message: 'Module Successfully Created',
            content: moduleInstance,
        };
    } catch (error) {
        return { success: false, message: [error.errors[0].message] };
    }
};

const createSubModule = async form => {
    try {
        const invalid400 = [];
        const invalid404 = [];

        // check module name duplicate
        const duplicateModule = await ACS_Modules.findOne({ name: form.name });
        if (duplicateModule) {
            invalid400.push('Module Name Already Taken / Exist');
        }

        // check if parent faq is exist and main module
        const mainModule = await ACS_Modules.findById(form.parentModuleId);
        if (!mainModule) {
            invalid404.push('Main / Parent Module Data Not Found');
        }

        if (invalid400.length > 0) {
            return {
                isValid: false,
                code: 400,
                message: invalid400,
            };
        }
        if (invalid404.length > 0) {
            return {
                isValid: false,
                code: 404,
                message: invalid404,
            };
        }

        const moduleInstance = await ACS_Modules.create(form);
        return {
            success: true,
            message: 'Module Successfully Created',
            content: moduleInstance,
        };
    } catch (error) {
        return { success: false, message: [error.errors[0].message] };
    }
};

const updateMainModule = async (id, form) => {
    try {
        const invalid400 = [];
        const invalid404 = [];

        // check module name duplicate
        const duplicateModule = await ACS_Modules.findOne({
            _id: { $ne: id },
            name: form.name,
        });

        if (duplicateModule) {
            invalid400.push('Module Name Already Taken / Exist');
        }

        // validate module id
        const moduleInstance = await ACS_Modules.findById(id);
        if (!moduleInstance) {
            invalid404.push('Module Data Not Found');
        }
        if (moduleInstance?.parentModuleId) {
            invalid400.push(
                'Cannot Update Sub Module Using Main Module Endpoint'
            );
        }

        if (invalid400.length > 0) {
            return {
                isValid: false,
                code: 400,
                message: invalid400,
            };
        }
        if (invalid404.length > 0) {
            return {
                isValid: false,
                code: 404,
                message: invalid404,
            };
        }

        moduleInstance.name = form.name;
        await moduleInstance.save();

        return {
            success: true,
            message: 'Module Successfully Updated',
            content: moduleInstance,
        };
    } catch (error) {
        return { success: false, message: [error.errors[0].message] };
    }
};

const updateSubModule = async (id, form) => {
    try {
        const invalid400 = [];
        const invalid404 = [];

        // check module name duplicate
        const duplicateModule = await ACS_Modules.findOne({
            _id: { $ne: id },
            name: form.name,
        });
        if (duplicateModule) {
            invalid400.push('Module Name Already Taken / Exist');
        }

        // validate module id
        const moduleInstance = await ACS_Modules.findById(id);
        if (!moduleInstance) {
            invalid404.push('Module Data Not Found');
        } else if (!moduleInstance?.parentModuleId) {
            invalid400.push(
                'Cannot Update Main Module Using Sub Module Endpoint'
            );
        }

        // check if parent faq is exist and main module
        const mainModule = await ACS_Modules.findById(form.parentModuleId);
        if (!mainModule) {
            invalid404.push('Main / Parent Module Data Not Found');
        } else if (mainModule?.parentModuleId) {
            invalid400.push('Sub Module Can\t be Set As Parent Module');
        }

        if (invalid400.length > 0) {
            return {
                isValid: false,
                code: 400,
                message: invalid400,
            };
        }
        if (invalid404.length > 0) {
            return {
                isValid: false,
                code: 404,
                message: invalid404,
            };
        }

        // after pass the check update instance with new data
        moduleInstance.parentModuleId = new mongoose.Types.ObjectId(
            form.parentModuleId
        );
        moduleInstance.name = form.name;
        await moduleInstance.save();

        return {
            success: true,
            message: 'Module Successfully Updated',
            content: moduleInstance,
        };
    } catch (error) {
        return { success: false, message: [error] };
    }
};

const deleteModule = async id => {
    const session = await ACS_Modules.startSession(); // Mulai session untuk transaksi
    session.startTransaction();

    try {
        // Validate module id
        const moduleInstance = await ACS_Modules.findById(id).session(session);
        if (!moduleInstance) {
            return {
                success: false,
                code: 404,
                message: ['Module Data Not Found'],
            };
        }

        const { name } = moduleInstance;

        // Delete the module
        await moduleInstance.deleteOne({ session });

        // Update child modules to nullify parentModuleId
        await ACS_Modules.updateMany(
            { parentModuleId: moduleInstance.id },
            { $set: { parentModuleId: null } },
            { session }
        );

        // Find and delete related features and their associations
        const deletedFeatures = await ACS_Features.find({
            moduleId: moduleInstance.id,
        }).session(session);
        const deletedFeatureIds = deletedFeatures.map(feature => feature.id);

        await ACS_RoleFeatures.deleteMany(
            { featureId: { $in: deletedFeatureIds } },
            { session }
        );

        await ACS_Features.deleteMany(
            { moduleId: moduleInstance.id },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: 'Module Successfully Deleted',
            content: `Module ${name} Successfully Deleted`,
        };
    } catch (error) {
        // Rollback the transaction
        await session.abortTransaction();
        session.endSession();
        return error;
    }
};

module.exports = {
    validateModuleQuery,
    selectAllModules,
    selectModule,
    createMainModule,
    createSubModule,
    updateMainModule,
    updateSubModule,
    deleteModule,
};
