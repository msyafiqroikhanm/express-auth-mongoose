/**
 * Helper function to generate filter and pagination parameters
 * @param {Object} query - Query params from request (req.query)
 * @param {Object} defaultPagination - Default pagination values
 * @param {Array<string>} searchFields - Fields to be included in the $or search
 * @returns {Object} { find, page, perPage }
 */
const getFilterAndPagination = (
    query,
    defaultPagination,
    searchFields = []
) => {
    const { search, page: queryPage, perPage: queryPerPage } = query;

    // Filtering logic
    const find = {};
    if (search && searchFields.length > 0) {
        find.$or = searchFields.map(field => ({
            [field]: { $regex: search, $options: 'i' },
        }));
    }

    // Pagination logic
    const page =
        parseInt(queryPage) > 0 ? parseInt(queryPage) : defaultPagination.page;
    const perPage =
        parseInt(queryPerPage) > 0
            ? parseInt(queryPerPage)
            : defaultPagination.perPage;

    return { find, page, perPage };
};

module.exports = { getFilterAndPagination };
