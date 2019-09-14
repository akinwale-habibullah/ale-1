/** 
* Validate a loan request row on the loans table either at creation or before approval
*
* @param {Integer} userId - userID of loan requester
* @param {Integer} guarantor1Id - userID of first guarantor
* @param {Integer} guarantor2Id - userID of second guarantor
* @param {Integer} loanAmount - loan amount requested
*
*/

const Loan = require('../../models/loan');
const Book = require('../../models/book');

async function validateLoanRequest(userId, guarantor1Id, guarantor2Id, loanAmount) {

  // Check number of guarantees for first guarantor
  const existingGuarantees = await Loan.checkExistingGuarantees(guarantor1Id);
  if (existingGuarantees >= 2) {
    return 'First guarantor has two or more guarantees'
  }

  // Check number of guarantees for second guarantor
  const existingGuarantees2 = await Loan.checkExistingGuarantees(guarantor2Id);
  if (existingGuarantees2 >= 2) {
    return 'Second guarantor has two or more guarantees'
  }

  const accountBook = await Book.findById(1);
  const requesterBalance = await accountBook.getBalance({ account: 'Savings', userId });
  if (requesterBalance.balance < (0.3 * loanAmount)) {
    return 'Your balance is less than 1/3 of loan amount'
  }

  const guarantor1IdBalance = await accountBook.getBalance({ account: 'Savings', userId: guarantor1Id });
  if (guarantor1IdBalance.balance < (0.3 * loanAmount)) {
    return `Your first guarantor's balance is less than 1/3 of loan amount`
  }

  const guarantor2IdBalance = await accountBook.getBalance({ account: 'Savings', userId: guarantor2Id });
  if (guarantor2IdBalance.balance < (0.3 * loanAmount)) {
    return `Your first guarantor's balance is less than 1/3 of loan amount`
  }
  return null;
}

module.exports = validateLoanRequest;
