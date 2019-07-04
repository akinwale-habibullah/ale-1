/**
 * Return a trial balance
 *
 * GET: /books/{bookId}/tb
 * 
 * query:
 *   startDate {string} Start date for Profit or Loss account.
 *   endDate {string} End date for Profit or Loss and Balance sheet.
 *   
 */
const Book = require('../../models/book');
const Account = require('../../models/account');
const { AleError, codes } = require('../errors');

exports.middleware = checkBook;

function checkBook(req, res, next) {
    const id = parseInt(req.params.bookId);
    Book.findByPk(id).then(book => {
        if (!book) {
            throw new AleError(`Book specified in params does not exist`, codes.BookDoesNotExist);
        }
        req.book = book;
        return next();
    }).catch(err => {
        return next(err);
    });
};

exports.handler = function getTb(req, res, next) {
    let id = parseInt(req.params.bookId);
    const { book } = req;
    let { startDate: reqStartDate, endDate } = req.query;
    
    // Get all accounts for the book and map through to get balances
    Account.getAccounts(id).then(async accounts => {
        let runningCreditTotal = 0;
        let runningDebitTotal = 0;
        let startDate
        const balances = [];

        for (result of accounts) {
            const account = await result.accountName;
            startDate = result.isPorL ? reqStartDate : null
            const balance = await book.getBalance({ account, startDate, endDate });


            runningCreditTotal += balance.creditTotal;
            runningDebitTotal += balance.debitTotal
            balances.push({ [result.accountName]: balance, info: { "increasingEntry": result.toIncrease, "isPorL": result.isPorL, "accountType": result.accountType, "subAccountType": result.subAccountType, from: startDate, till: endDate } })
        }
        const resultArray = await Promise.all(balances);
        res.json({
            success: true,
            message: `TB balance status: ${runningCreditTotal === runningDebitTotal}`,
            data: resultArray
        })
    }).catch(err => {
        return next(err);
    });
};
