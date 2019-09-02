/**
 * Create a new loan request
 *
 * POST: /loans
 * 
 * body:
 *   loanAmount {float} Loan amount requested.
 *   interest {float} Calculated interest on loan.
 *   fee {float} Calculated fee on loan.
 *   tenure {integer} Count of loan repayment instanced, monthly preferrably.
 *   comments {string} Applicant's comments with the application.
 *   guarantor1 {integer} First nominated guarantor.
 *   guarantor2 {integer} Second nominated guarantor.
 *   
 */

const Loan = require('../../models/loan');
const Book = require('../../models/book');
const Repayment = require('../../models/repayment');
const Promo = require('../../models/promo');
const validateLoanRequest = require('../helpers/validateLoanRequest');

exports.handler = async function postLoans(req, res, next) {
  const { userId } = req;
  // Include middleware to validate guarantors is still a member
  const { loanAmount, tenure, guarantor1, guarantor2, comments, type } = req.body;

  try {
    // Check for same guarantors
    if (guarantor1 == guarantor2) {
      return res.json({
        success: false,
        message: 'Please use different guarantors',
      })
    }

    const loanCheck = await validateLoanRequest(userId, guarantor1, guarantor2, loanAmount);

    if (loanCheck) {
      return res.json({
        success: false,
        message: loanCheck,
      })
    }

    const newLoan = await Loan.create({ debtorId: userId, loanAmount, tenure, guarantor1, guarantor2, comments, type, status: 'pending' })
    res.json({
      success: true,
      message: 'New loan request created',
      data: newLoan
    })
    next()

  } catch (error) {
    // Catch and return errors
    next(error);
  }
};
