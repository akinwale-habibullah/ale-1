/**
 * Get pending savings change requests
 *
 * GET: /savings
 * 
 */

const User = require('../../models/user');
const { AleError, codes } = require('../errors');
exports.handler = async function getSavingsChange(req, res, next) {
  const { isAdmin } = req;
  try {
    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this function',
      })
    }
    const pendingSavingsChange = await User.findAll({ where: { savingsDateAndAmountApproval: 'pending' }, attributes: { exclude: ['password'] } });
    return res.json({
      success: true,
      message: `Pending savings change returned`,
      data: pendingSavingsChange
    })
  } catch (error) {
    return next(err);
  }
}
