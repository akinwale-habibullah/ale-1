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
    prevSavingsAmount: newPrevSavingsAmount,
    prevSavingsDate: newPrevSavingsDate,
    nextSavingsDate: newNextSavingsDate,
    nextSavingsAmount: newNextSavingsAmount,
    savingsDateAndAmountApproval: newsavingsDateAndAmountApproval,
    position: newPosition,
    phone: newPhone,
    status: newStatus,
    isGuarantor: newIsGuarantor,
  } = req.body

  try {

    let updatedDetails

    if (isAdmin) {
      // Update user details
      updatedDetails = await User.adminUpdateDetails(
        id,
        isAdmin,
        email,
        newFirstName,
        newLastName,
        newJoinDate,
        newMemberId,
        newPrevSavingsDate,
        newPrevSavingsAmount,
        newNextSavingsDate,
        newNextSavingsAmount,
        newsavingsDateAndAmountApproval,
        newPosition,
        newPhone,
        newStatus,
        newIsGuarantor,
      );
    }

    if (!isAdmin) {
      // Update user details
      updatedDetails = await User.updateDetails(
        id,
        isAdmin,
        email,
        newFirstName,
        newLastName,
        newJoinDate,
        newMemberId,
        newPrevSavingsDate,
        newPrevSavingsAmount,
        newNextSavingsDate,
        newNextSavingsAmount,
        newsavingsDateAndAmountApproval,
        newPosition,
        newPhone,
        newStatus,
        newIsGuarantor,
      );
    }
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
