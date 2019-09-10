/**
 * Get cooperative statistics
 *
 * GET: /stats
 * 
 */

const dotenv = require('dotenv');
dotenv.config();

const Book = require('../../models/book');
const User = require('../../models/user');
const { AleError, codes } = require('../errors');
const { SAVINGSACCOUNT } = process.env;
const { LOANSACCOUNT } = process.env;
exports.handler = async function getStats(req, res, next) {
  const { isAdmin } = req;

  try {
    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this function',
      })
    }

    const book = await Book.findById(1);
    const inQuote = true;
    if (!book) {
      throw new AleError(`Book with id ${1} does not exist`, codes.BookDoesNotExist);
    }
    const totalSavingsBalance = await book.getBalance({ account: SAVINGSACCOUNT }, inQuote);
    const totalLoansBalance = await book.getBalance({ account: LOANSACCOUNT }, inQuote);
    const allSavingsTransactions = await book.allTransactions({ account: SAVINGSACCOUNT }, inQuote);
    const allLoansTransactions = await book.allTransactions({ account: LOANSACCOUNT }, inQuote);
    const memberCount = await User.count({ where: { status: 'active' } });
    return res.json({
      success: true,
      message: `General cooperative stats returned`,
      data: { totalSavingsBalance, totalLoansBalance, allSavingsTransactions, allLoansTransactions, memberCount }
    })
  } catch (error) {
    return next(err);
  }
}
