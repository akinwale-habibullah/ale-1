const Account = require('../../models/Account');

async function checkAccount(req, res, next) {
  let noError = true;

  for (entry of req.body.transactions) {
    const account = await Account.findOne({ where: { accountCode: entry.accountCode } });
    if (!account) {
      noError = false;
      return res.status(404).json({
        success: false,
        message: `Account code ${entry.account} is not found.`,
      })
    }

    if (account && account.accountName != entry.account) {
      noError = false;
      return res.status(400).json({
        success: false,
        message: `Account code ${entry.accountCode} does not match account name ${entry.account}`,
      })
    }
  }
  if (noError) {
    return next();
  }
};

module.exports = checkAccount;
