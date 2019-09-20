/**
 * Approve a loan request
 *
 * PATCH: /loans
 * 
 * query:
 *   loanId Id of loan to be processed.
 *   
 */

const dotenv = require('dotenv');
dotenv.config();

const Loan = require('../../models/loan');
const validateLoanRequest = require('../helpers/validateLoanRequest');

/**
 * Handles approval or rejection of loans
 * 
 * @param {*} loan - Loan entry from database
 * @param {*} userId - Id of approving/denying officer
 * @param {*} status - Intended status of loan
 * @param {*} userPosition - Position of approving/rejecting user
 * @param {*} FIRSTLEVELLOANAPPROVER - Configured first level approver position from env file
 * @param {*} SECONDLEVELLOANAPPROVER - Configured second level approver position from env file
 */
async function approvalModule(loan, userId, status, userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER) {

  const userAuth = await checkUserPosition(userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER)
  if (userAuth) {
    return { success: false, message: userAuth, data: null }
  }

  if (userPosition == FIRSTLEVELLOANAPPROVER && status == 'approved') {
    const updatedLoan = await loan.update({ approver1Id: userId })
    if (updatedLoan.approver1Id == userId) {
      return {
        success: true,
        message: 'First level approval has been included',
        data: updatedLoan
      };
    }
  }

  if (userPosition == SECONDLEVELLOANAPPROVER && status == 'approved') {
    const updatedLoan = await loan.update({ approver2Id: userId, status: approved })
    if (updatedLoan.approver2Id == userId) {
      return {
        success: true,
        message: 'Loan has finally been approved',
        data: updatedLoan
      };
    }
  }

  if (userPosition == FIRSTLEVELLOANAPPROVER && status == 'rejected') {
    const updatedLoan = await loan.update({ rejecter1Id: userId })
    if (updatedLoan.rejecter1Id == userId) {
      return {
        success: true,
        message: 'First level rejection has been included',
        data: updatedLoan
      };
    }
  }

  if (userPosition == SECONDLEVELLOANAPPROVER && status == 'rejected') {
    const updatedLoan = await loan.update({ rejecter2Id: userId, status: rejected })
    if (updatedLoan.rejecter2Id == userId) {
      return {
        success: true,
        message: 'Loan has finally been rejected',
        data: updatedLoan
      };
    }
  }
}

function checkUserPosition(userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER) {
  if ((userPosition != FIRSTLEVELLOANAPPROVER) && (userPosition != SECONDLEVELLOANAPPROVER)) {
    return `Only ${FIRSTLEVELLOANAPPROVER} or ${SECONDLEVELLOANAPPROVER} can approve/reject loans`
  }
  return null;
}

exports.handler = async function approveLoans(req, res, next) {
  const { userId, userPosition } = req;
  const { loanId, status } = req.query;
  const { FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER } = process.env;

  try {

    const loan = await Loan.findOne({ where: { id: loanId } });

    if (!loan) {
      return res.json({
        success: false,
        message: 'Loan with selected ID does not exist',
      })
    }

    if (loan.type == 'promo') {
      const { success, message, data } = await approvalModule(loan, userId, status, userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER)
      res.json({
        success,
        message,
        data
      })
    }

    if (status == 'rejected') {
      const { success, message, data } = await approvalModule(loan, userId, status, userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER)
      res.json({
        success,
        message,
        data
      })
    }

    const loanCheck = await validateLoanRequest(loan.debtorId, loan.guarantor1Id, loan.guarantor2Id, loan.loanAmount);

    if (loanCheck) {
      return res.json({
        success: false,
        message: loanCheck,
      })
    }

    const { success, message, data } = await approvalModule(loan, userId, status, userPosition, FIRSTLEVELLOANAPPROVER, SECONDLEVELLOANAPPROVER)
    res.json({
      success,
      message,
      data
    })

    next()
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
