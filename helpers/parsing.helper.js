const parsingUserModules = userInstance => {
    // get parsed feature and module in user
    const parsedFeatures = [];
    // userInstance.Role.USR_Features.forEach((feature) => {
    //   parsedFeatures.push({
    //     id: feature.dataValues.id,
    //     name: feature.dataValues.name,
    //     moduleId: feature.USR_Module.dataValues.id,
    //     modulesName: feature.USR_Module.dataValues.name,
    //     parentModuleId: feature.USR_Module.parentModule?.dataValues.id || null,
    //     parentModule: feature.USR_Module.parentModule?.dataValues.name || null,
    //   });
    // });

    // console.log(JSON.stringify(userInstancerole, null, 2));
    // console.log(userInstance.user.role);
    userInstance.role.roleFeatures.forEach(roleFeature => {
        parsedFeatures.push({
            id: roleFeature.feature._id,
            name: roleFeature.feature.name,
            moduleId: roleFeature.feature.module._id,
            modulesName: roleFeature.feature.module.name,
            parentModuleId: roleFeature.feature.module.parentModule.id || null,
            parentModule: roleFeature.feature.module.parentModule.name || null,
        });
    });

    const outputObject = {};

    parsedFeatures.forEach(item => {
        const {
            id: featureId,
            name: featurename,
            moduleId: subModuleId,
            modulesName: subModule,
            parentModuleId,
            parentModule,
        } = item;

        if (parentModuleId === null && parentModule === null) {
            // If both parentModuleId and parentModule are null, it's a main module
            if (!outputObject[subModuleId]) {
                outputObject[subModuleId] = {
                    parentModuleId: subModuleId,
                    parentModule: subModule,
                    features: [],
                };
            }

            outputObject[subModuleId].features.push({
                featureId,
                featurename,
            });
        } else {
            // If parentModuleId is not null, it's a submodule
            if (!outputObject[parentModule]) {
                outputObject[parentModule] = {
                    parentModuleId,
                    parentModule,
                    submodules: [],
                };
            }

            const existingSubmodule = outputObject[
                parentModule
            ].submodules.find(
                submodule => submodule.subModuleId === subModuleId
            );

            if (existingSubmodule) {
                existingSubmodule.features.push({
                    featureId,
                    featurename,
                });
            } else {
                outputObject[parentModule].submodules.push({
                    subModuleId,
                    subModule,
                    features: [
                        {
                            featureId,
                            featurename,
                        },
                    ],
                });
            }
        }
    });

    return Object.values(outputObject);
};

module.exports = {
    parsingUserModules,
};
