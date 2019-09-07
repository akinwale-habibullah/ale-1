/**
 * Get savings &amp; loans balance and history
 *
 * GET: /savingsandloans
 * 
 * header:
 *   x-access-token user token.
 *   
 */

const dotenv = require('dotenv');
dotenv.config();

const Book = require('../../models/book');
const Loan = require('../../models/loan');
const { AleError, codes } = require('../errors');
const { SAVINGSACCOUNT } = process.env;
const { LOANSACCOUNT } = process.env;

exports.handler = async function getSavingsAndLoans(req, res, next) {
  // let id = parseInt(req.params.bookId);
  const { userId } = req;

  try {
    const book = await Book.findById(1);
    const inQuote = true;
    if (!book) {
      throw new AleError(`Book with id ${1} does not exist`, codes.BookDoesNotExist);
    }
    const savingsBalance = await book.getBalance({ account: SAVINGSACCOUNT, userId }, inQuote);
    const loansBalance = await book.getBalance({ account: LOANSACCOUNT, userId }, inQuote);
    const savingsTransactions = await book.allTransactions({ account: SAVINGSACCOUNT, userId }, inQuote);
    const loansTransactions = await book.allTransactions({ account: LOANSACCOUNT, userId }, inQuote);
    const loans = await Loan.findAll({ where: { debtorId: userId } });

    console.log('result', loans);


    return res.json({
      success: true,
      message: `User savings & loans balance and transactions returned`,
      data: { savingsBalance, loansBalance, savingsTransactions, loansTransactions, loans }
    })

  } catch (error) {
    return next(error);
  }
}
