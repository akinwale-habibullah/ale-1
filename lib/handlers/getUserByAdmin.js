/**
 * Get user details
 *
 * GET: /userdetails
 * 
 * header:
 *   x-access-token admin token.
 *   
 */

const User = require('../../models/user');

exports.handler = async function getUser(req, res, next) {
  const { isAdmin } = req;
  const { memberId } = req.query;
  
  try {
    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this route',
      })
    }
    if (!memberId) {
      return res.json({
        success: false,
        message: 'Send member ID to search for in params',
      })
    }
    // Get user details and return cleaned data values
    const userDetails = await User.getUserDetailsByMemberId(memberId);
    return res.json({
      success: true,
      message: 'User data returned',
      data: userDetails
    })
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
