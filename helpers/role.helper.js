const slugify = require('slugify');
const { USR_Role } = require('../models');

const roleHelper = async () => {
  const roles = await USR_Role.findAll({ attributes: ['id', 'name'] });

  const rolesInstance = {};
  roles.forEach((roole) => {
    rolesInstance[
      `${slugify(roole.name, {
        replacement: '_',
        lower: true,
        strict: true,
      })}`
    ] = roole.id;
  });

  return rolesInstance;
};

module.exports = roleHelper;
