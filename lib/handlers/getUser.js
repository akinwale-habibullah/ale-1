/**
 * Get user details
 *
 * GET: /users
 * 
 * header:
 *   x-access-token user token.
 *   
 */

const User = require('../../models/user');

exports.handler = async function getUser(req, res, next) {
  const { userId } = req;
  try {
    // Get user details and return cleaned data values
    const userDetails = await User.getUserDetails(userId);
    res.json({
      success: true,
      message: 'User data returned',
      data: userDetails
    })
    next()
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
