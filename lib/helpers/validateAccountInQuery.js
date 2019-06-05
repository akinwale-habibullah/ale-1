const Account = require('../../models/Account');

async function checkAccountInQuery(req, res, next) {
  const { account, accountCode } = req.query;
  let noError = true;

  const result = await Account.findOne({ where: { accountCode } });
  if (!result) {
    noError = false;
    return res.status(404).json({
      success: false,
      message: `Account code ${accountCode} is not found.`,
    })
  }

  if (result && result.accountName != account) {
    noError = false;
    return res.status(400).json({
      success: false,
      message: `Account code ${accountCode} does not match account name ${account}`,
    })
  }

  if (noError) {
    return next();
  }
};

module.exports = checkAccountInQuery;
