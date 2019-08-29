/**
 * Get all member details
 *
 * GET: /members
 * 
 * header:
 *   x-access-token user token.
 *   
 */

const User = require('../../models/user');

exports.handler = async function getMembers(req, res, next) {
  const { isAdmin } = req;
  try {
    // Get full details if user isAdmin
    const allUserDetails = await User.getAllDetails(isAdmin);
    res.json({
      success: true,
      message: 'All user data returned',
      data: allUserDetails
    })
    next()
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}