/**
 * Edit user details
 *
 * POST: /users
 * 
 * query:
 *   email email address of user to change details for.
 *   
 */

const User = require('../../models/user');

exports.handler = async function editUser(req, res, next) {
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

    const cleanedResult = {
      id: updatedDetails.id,
      firstName: updatedDetails.firstName,
      lastName: updatedDetails.lastName,
      email: updatedDetails.email,
      userName: updatedDetails.userName,
      joinDate: updatedDetails.joinDate,
      memberId: updatedDetails.memberId,
      nextSavingsDate: updatedDetails.nextSavingsDate,
      nextSavingsAmount: updatedDetails.nextSavingsAmount,
      position: updatedDetails.position,
      phone: updatedDetails.phone,
      status: updatedDetails.status,
      isGuarantor: updatedDetails.isGuarantor,
      createdAt: updatedDetails.createdAt,
      updatedAt: updatedDetails.updatedAt
    }

    res.json({
      success: true,
      message: 'User data updated',
      data: cleanedResult
    })
    next()
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
