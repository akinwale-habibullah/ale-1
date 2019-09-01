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
const Repayment = require('../../models/repayment');
const Promo = require('../../models/promo');

exports.handler = async function postLoans(req, res, next) {
  const { userId } = req;
  // Include middleware to validate guarantors is still a member
  const { loanAmount, tenure, guarantor1, guarantor2, comments, type } = req.body;
  console.log('loggin', userId, loanAmount, tenure, guarantor1, guarantor2);

  try {
    const newLoan = await Loan.create({ debtorId: userId, loanAmount, tenure, guarantor1, guarantor2, comments, type, status: 'pending' })
    res.json({
      success: true,
      message: 'New loan created',
      data: newLoan
    })
    next()

  } catch (error) {
    // Catch and return errors
    next(error);
  }
};
