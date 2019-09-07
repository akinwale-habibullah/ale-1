/**
 * Edit user details
 *
 * POST: /users
 * 
 * query:
 *   email
 *   
 */

const User = require('../../models/user');

exports.handler = async function editUser(req, res, next) {
  const { userId: id, isAdmin } = req;
  const { email } = req.query;
  const {
    firstName: newFirstName,
    lastName: newLastName,
    joinDate: newJoinDate,
    memberId: newMemberId,
    nextSavingsDate: newNextSavingsDate,
    nextSavingsAmount: newNextSavingsAmount,
    position: newPosition,
    phone: newPhone,
    status: newStatus,
    isGuarantor: newIsGuarantor,
  } = req.body

  try {
    // Update user details
    const updatedDetails = await User.updateDetails(
      id,
      isAdmin,
      email,
      newFirstName,
      newLastName,
      newJoinDate,
      newMemberId,
      newNextSavingsDate,
      newNextSavingsAmount,
      newPosition,
      newPhone,
      newStatus,
      newIsGuarantor,
    );

    return res.json({
      success: true,
      message: 'User data updated',
      data: updatedDetails
    })

  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
