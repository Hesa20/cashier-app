/**
 * Standard API Response Helpers
 * Ensures consistent response format across all endpoints
 */

const response = {
  /**
   * Success response
   * @param {Object} h - Hapi response toolkit
   * @param {*} data - Response data
   * @param {String} message - Success message
   * @param {Number} code - HTTP status code (default: 200)
   */
  success: (h, data, message = 'Success', code = 200) => {
    return h.response({
      status: 'success',
      message,
      data
    }).code(code);
  },

  /**
   * Error response for validation failures
   * @param {Object} h - Hapi response toolkit
   * @param {String} message - Error message
   * @param {Array} errors - Array of validation errors
   */
  validationError: (h, message = 'Validation failed', errors = []) => {
    return h.response({
      status: 'fail',
      message,
      errors
    }).code(400);
  },

  /**
   * Error response for server errors
   * @param {Object} h - Hapi response toolkit
   * @param {String} message - Error message
   * @param {Number} code - HTTP status code (default: 500)
   */
  error: (h, message = 'Internal server error', code = 500) => {
    return h.response({
      status: 'error',
      message,
      statusCode: code
    }).code(code);
  },

  /**
   * Not found response
   * @param {Object} h - Hapi response toolkit
   * @param {String} resource - Resource name (e.g., 'Product', 'Category')
   */
  notFound: (h, resource = 'Resource') => {
    return h.response({
      status: 'error',
      message: `${resource} tidak ditemukan`,
      statusCode: 404
    }).code(404);
  }
};

module.exports = response;
