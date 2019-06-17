const Account = require('../../models/Account');
const User = require('../../models/User');
const Company = require('../../models/Company');

async function checkSubAccountQuery(req, res, next) {
  const { userId, companyId } = req.query;
  let noError = true;

  if (userId && companyId) {
    return res.status(400).json({
      success: false,
      message: `Specify either userId or companyId for query, not both`,
    })
  }

  if (userId) {

    const result = await User.findOne({ where: { id: userId } });
    if (!result) {
      noError = false;
      return res.status(404).json({
        success: false,
        message: `User with id ${userId} is not found.`,
      })
    }

    if (noError) {
      return next();
    }
  } else if (companyId) {

    const result = await Company.findOne({ where: { id: companyId } });
    if (!result) {
      noError = false;
      return res.status(404).json({
        success: false,
        message: `Company with id ${companyId} is not found.`,
      })
    }

    if (noError) {
      return next();
    }
  } else {
    return res.status(400).json({
      success: false,
      message: `Specify either userId or companyId for query`,
    })
  }

}

module.exports = checkSubAccountQuery;
