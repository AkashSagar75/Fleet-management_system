
const invalid = (res, message) => res.status(400).json({
  success: false,
  message,
});

const validateGetData = (req, res, next) => {
  const {
    tableName,
    companyId: rawCompanyId,
    page: rawPage = '1',
    limit: rawLimit = '50',
    search = '',
    searchColumns = [],
  } = req.query || {};
  const companyId = Number(rawCompanyId);
  const page = Number(rawPage);
  const limit = Number(rawLimit);

  if (typeof tableName !== 'string' || !tableName.trim()) {
    return invalid(res, "Invalid or missing 'tableName'.");
  }
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return invalid(res, "Invalid or missing 'companyId'.");
  }
  if (!Number.isInteger(page) || page < 1) {
    return invalid(res, "Invalid 'page'. Must be a positive integer.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return invalid(res, "Invalid 'limit'. Must be an integer between 1 and 100.");
  }
  req.validatedGetData = { tableName, companyId, page, limit, search, searchColumns };
  return next();
};

module.exports = validateGetData;