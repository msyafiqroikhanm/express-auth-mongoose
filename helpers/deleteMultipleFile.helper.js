const { relative } = require('path');
const deleteFile = require('./deleteFile.helper');

const deleteFiles = async files => {
    let error;

    // Recursive function to delete files sequentially
    const deleteNextFile = async index => {
        // Base case: if all files have been processed, return
        if (index >= files.length) return;

        const file = files[index];
        try {
            await deleteFile(
                relative(__dirname, file[0].path).replace('../../', '')
            );
        } catch (err) {
            // If an error occurs during deletion, assign it to the error variable
            error = err;
            return; // Terminate recursion
        }

        // Recursively process the next file
        await deleteNextFile(index + 1);
    };

    // Start deleting files sequentially from index 0
    await deleteNextFile(0);
    return error;
};

module.exports = {
    deleteFiles,
};
