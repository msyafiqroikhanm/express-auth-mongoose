const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { SYS_Configuration } = require('../models');

const createInvalidImportLog = async (data) => {
  const logPath = path.join(__dirname, '../public/logs');

  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }

  const BASE_URL = await SYS_Configuration.findOne({ where: { name: { [Op.substring]: 'Base URL' } } });

  const fileName = `public/logs/log-${Date.now()}.txt`;
  const logFile = path.join(__dirname, '../', fileName);

  await fsp.writeFile(logFile, data);

  return { url: `${BASE_URL ? BASE_URL.value : ''}/${fileName}`, filePath: logFile };
};

module.exports = {
  createInvalidImportLog,
};
