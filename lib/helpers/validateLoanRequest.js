/** 
* Validate a loan request row on the loans table either at creation or before approval
*
* @param {Integer} userId - userID of loan requester
* @param {Integer} guarantor1 - userID of first guarantor
* @param {Integer} guarantor2 - userID of second guarantor
* @param {Integer} loanAmount - loan amount requested
*
*/

const Loan = require('../../models/loan');
const Book = require('../../models/book');

async function validateLoanRequest(userId, guarantor1, guarantor2, loanAmount) {

  // Check number of guarantees for first guarantor
  const existingGuarantees = await Loan.checkExistingGuarantees(guarantor1);
  if (existingGuarantees >= 2) {
    return 'First guarantor has two or more guarantees'
  }

  // Check number of guarantees for second guarantor
  const existingGuarantees2 = await Loan.checkExistingGuarantees(guarantor2);
  if (existingGuarantees2 >= 2) {
    return 'Second guarantor has two or more guarantees'
  }

  const accountBook = await Book.findById(1);
  const requesterBalance = await accountBook.getBalance({ account: 'Savings', userId });
  console.log('requesterBalance', requesterBalance, requesterBalance.balance < (0.3 * loanAmount))
  if (requesterBalance.balance < (0.3 * loanAmount)) {
    return 'Your balance is less than 1/3 of loan amount'
  }

  const guarantor1Balance = await accountBook.getBalance({ account: 'Savings', userId: guarantor1 });
  console.log('guarantor1Balance', guarantor1Balance)
  if (guarantor1Balance.balance < (0.3 * loanAmount)) {
    return `Your first guarantor's balance is less than 1/3 of loan amount`
  }

  const guarantor2Balance = await accountBook.getBalance({ account: 'Savings', userId: guarantor2 });
  console.log('guarantor2Balance', guarantor2Balance)
  if (guarantor2Balance.balance < (0.3 * loanAmount)) {
    return `Your first guarantor's balance is less than 1/3 of loan amount`
  }
  return null;
}

module.exports = validateLoanRequest;
