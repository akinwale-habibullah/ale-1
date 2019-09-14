/**
 * Edit user details
 *
 * POST: /userdetails
 * 
 * header:
 *   x-access-token admin token.
 *   
 */

const User = require('../../models/user');

exports.handler = async function editUser(req, res, next) {
  const { isAdmin } = req;
  const { memberId } = req.query;
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

    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can carry out this operation',
      })
    }

    updatedDetails = await User.adminUpdateDetails(
      memberId,
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
