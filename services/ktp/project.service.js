const { default: mongoose } = require('mongoose');
const KTP_Projects = require('../../models/ktpProject');
const { DEFAULT_PAGINATION } = require('../../libraries/general.lib');
const KTP_Respondents = require('../../models/ktpRespondent');

const validateProjectInputs = async (form, id) => {
    const invalid400 = [];

    const isDuplicateProjectID = await KTP_Projects.findOne(
        id
            ? {
                  _id: { $ne: new mongoose.Types.ObjectId(id) },
                  projectId: form.projectId,
              }
            : { projectId: form.projectId }
    );
    if (isDuplicateProjectID) {
        invalid400.push('ProjectID is already exist');
    }

    if (invalid400.length) {
        return {
            isValid: false,
            code: 400,
            message: invalid400,
        };
    }

    const newForm = {
        projectId: form.projectId,
        name: form.name,
        study: form.study,
        department: form.department,
    };

    if (form.isActive) {
        newForm.isActive = form.isActive === 'true';
    }

    return {
        isValid: true,
        form: newForm,
    };
};

const createKTPProject = async form => {
    const project = await KTP_Projects.create(form);

    return {
        success: true,
        message: 'Project Successfully Created',
        content: {
            _id: project._id,
            projectId: project.projectId,
            name: project.name,
            department: project.department,
            study: project.study,
            isActive: project.isActive,
        },
    };
};

const selectAllProjects = async (
    find,
    page = 1,
    perPage = DEFAULT_PAGINATION.perPage
) => {
    const skip = (page - 1) * perPage;

    const total = await KTP_Projects.countDocuments(find);

    const projects = await KTP_Projects.find(find, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    })
        .skip(skip)
        .limit(perPage);

    const totalPage = Math.ceil(total / perPage);

    return {
        success: true,
        message: 'Successfully Getting All Projects',
        content: projects,
        pagination: {
            page,
            perPage,
            total,
            totalPage,
        },
    };
};

const selectProjectDetail = async id => {
    const project = await KTP_Projects.findById(id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    });
    if (!project) {
        return {
            success: false,
            code: 404,
            message: ['Project Not Found'],
        };
    }

    return {
        success: true,
        message: 'Successfully Getting Project Detail',
        content: project,
    };
};

const updateKTPProject = async (id, form) => {
    const project = await KTP_Projects.findById(id);
    if (!project) {
        return {
            success: false,
            code: 404,
            message: ['Project Not Found'],
        };
    }

    project.projectId = form.projectId;
    project.name = form.name;
    project.isActive = form.isActive;
    project.study = form.study;
    project.department = form.department;
    await project.save();

    return {
        success: true,
        message: 'Successfully Update Project',
        content: {
            _id: project._id,
            projectId: project.projectId,
            name: project.name,
            department: project.department,
            study: project.study,
            isActive: project.isActive,
        },
    };
};

const updateActivationProject = async (id, form) => {
    const project = await KTP_Projects.findById(id);
    if (!project) {
        return {
            success: false,
            code: 404,
            message: ['Project Not Found'],
        };
    }

    project.isActive = form.isActive === 'true';
    await project.save();

    return {
        success: true,
        message: 'Successfully Update Project Activation',
        content: {
            _id: project.id,
            isActive: project.isActive,
        },
    };
};

const deleteKTPProject = async id => {
    const project = await KTP_Projects.findById(id);
    if (!project) {
        return {
            success: false,
            code: 404,
            message: ['Project Not Found'],
        };
    }

    const projectRespondents = await KTP_Respondents.find({
        projectId: id,
    });

    if (projectRespondents.length) {
        return {
            success: fale,
            code: 400,
            message: ['Project Cannot Be Deleted, There Are Respondents'],
        };
    }

    await KTP_Projects.updateOne({ _id: id }, { deletedAt: new Date() });

    return {
        success: true,
        message: 'Successfully Delete Project',
        content: `Project ${project.name} Has Been Deleted`,
    };
};

module.exports = {
    validateProjectInputs,
    createKTPProject,
    selectAllProjects,
    selectProjectDetail,
    updateKTPProject,
    deleteKTPProject,
    updateActivationProject,
};
