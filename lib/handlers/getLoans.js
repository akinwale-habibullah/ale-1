/**
 * Get all existing loan requests
 *
 * GET: /loans
 * 
 */

const Loan = require('../../models/loan');
const User = require('../../models/user');
exports.handler = async function getLoans(req, res, next) {
  const { isAdmin } = req;
  try {
    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this function',
      })
    }
    const loans = await Loan.findAll({
      include: [{ all: true }]
    });
    return res.json({
      success: true,
      message: `All loans returned`,
      data: loans
    })
  } catch (error) {
    return next(error);
  }
}
