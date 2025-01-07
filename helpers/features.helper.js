const slugify = require('slugify');
const ACS_Features = require('../models/acsFeature');

const features = async () => {
    const allFeature = await ACS_Features.find({}, { _id: 1, name: 1 });

    const featureList = {};
    allFeature.forEach(feature => {
        featureList[
            `${slugify(feature.name, {
                replacement: '_',
                lower: true,
                strict: true,
            })}`
        ] = feature.id;
    });

    return featureList;
};

module.exports = features;
