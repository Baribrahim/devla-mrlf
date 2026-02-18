/**
 * Pagination utility.
 *
 * Parses and validates pagination parameters from query strings.
 * Used across product listing endpoints.
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * Parse pagination params from request query.
 * Returns sanitized { page, limit } values.
 */
function parsePaginationParams(query = {}) {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (isNaN(page) || page < 1) {
        page = DEFAULT_PAGE;
    }

    if (isNaN(limit) || limit < 1) {
        limit = DEFAULT_LIMIT;
    }

    if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
    }

    return { page, limit };
}

/**
 * Build pagination links for the response.
 * Helps clients navigate between pages.
 */
function buildPaginationLinks(baseUrl, { page, limit, totalPages }) {
    const links = {};

    if (page > 1) {
        links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
        links.first = `${baseUrl}?page=1&limit=${limit}`;
    }

    if (page < totalPages) {
        links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
        links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    }

    return links;
}

module.exports = { parsePaginationParams, buildPaginationLinks, DEFAULT_LIMIT, MAX_LIMIT };
