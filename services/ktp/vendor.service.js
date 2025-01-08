const { default: mongoose } = require('mongoose');
const { DEFAULT_PAGINATION } = require('../../libraries/general.lib');
const KTP_Vendors = require('../../models/ktpVendor');
const KTP_Respondents = require('../../models/ktpRespondent');

const validateVendorInputs = async (form, id) => {
    const invalid400 = [];

    const isDuplicateName = await KTP_Vendors.findOne(
        id
            ? {
                  _id: { $ne: new mongoose.Types.ObjectId(id) },
                  name: form.name,
              }
            : { name: form.name }
    );
    if (isDuplicateName) {
        invalid400.push('Vendor name already exists');
    }

    if (invalid400.length) {
        return {
            isValid: false,
            code: 400,
            message: invalid400,
        };
    }

    return {
        isValid: true,
        form: {
            name: form.name,
            type: form.type,
        },
    };
};

const createKTPVendor = async form => {
    const vendor = await KTP_Vendors.create(form);

    return {
        success: true,
        message: 'Vendor Successfully Created',
        content: {
            _id: vendor._id,
            name: vendor.name,
            type: vendor.type,
        },
    };
};

const selectAllVendors = async (
    find,
    page = 1,
    perPage = DEFAULT_PAGINATION.perPage
) => {
    const skip = (page - 1) * perPage;

    const total = await KTP_Vendors.countDocuments(find);

    const vendors = await KTP_Vendors.find(find, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    })
        .skip(skip)
        .limit(perPage)
        .sort({ name: 1 });

    const totalPage = Math.ceil(total / perPage);

    return {
        success: true,
        message: 'Successfully Getting All Vendors',
        content: vendors,
        pagination: {
            page,
            perPage,
            total,
            totalPage,
        },
    };
};

const selectKTPVendor = async id => {
    const vendor = await KTP_Vendors.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    if (!vendor) {
        return {
            success: false,
            code: 404,
            message: ['Vendor Not Found'],
        };
    }

    return {
        success: true,
        message: 'Successfully Getting Vendor Detail',
        content: vendor,
    };
};

const updateKTPVendor = async (form, id) => {
    const vendor = await KTP_Vendors.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    if (!vendor) {
        return {
            success: false,
            code: 404,
            message: ['Vendor Not Found'],
        };
    }

    (vendor.name = form.name), (vendor.type = form.type);
    await vendor.save();

    return {
        success: true,
        message: 'Vendor Updated Successfully',
        content: {
            _id: vendor._id,
            name: vendor.name,
            type: vendor.type,
        },
    };
};

const deleteKTPVendor = async id => {
    const vendor = await KTP_Vendors.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    if (!vendor) {
        return {
            success: false,
            code: 404,
            message: ['Vendor Not Found'],
        };
    }

    const vendorRespondents = await KTP_Respondents.find({
        vendorId: id,
    });

    if (vendorRespondents.length) {
        return {
            success: fale,
            code: 400,
            message: ['Vendor Cannot Be Deleted, There Are Respondents'],
        };
    }

    await KTP_Vendors.updateOne({ _id: id }, { deletedAt: new Date() });

    return {
        success: true,
        message: 'Vendor Deleted Successfully',
        content: `Vendor ${vendor.name} Has Been Deleted`,
    };
};

module.exports = {
    validateVendorInputs,
    createKTPVendor,
    selectAllVendors,
    selectKTPVendor,
    updateKTPVendor,
    deleteKTPVendor,
};
