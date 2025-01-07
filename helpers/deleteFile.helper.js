const fs = require('fs');
const path = require('path');

const isURL = variable => {
    const urlPattern = /^(http:\/\/|https:\/\/)/;
    return urlPattern.test(variable);
};

const deleteFile = async (filePath, defaultFilePath = null) => {
    try {
        if (defaultFilePath && filePath === defaultFilePath) {
            return;
        }
        if (filePath === null || filePath === undefined) {
            return;
        }
        if (isURL(filePath)) {
            return;
        }

        if (filePath.includes('..')) {
            await fs.promises.unlink(path.join(__dirname, filePath));
        } else {
            await fs.promises.unlink(path.join(__dirname, '../', filePath));
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // eslint-disable-next-line no-console
            console.warn(
                `Failed to delete file, missing file = ${error.message.split(', unlink ')[1]}`
            );
        } else {
            throw error;
        }
    }
};

module.exports = deleteFile;
