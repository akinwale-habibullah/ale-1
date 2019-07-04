/**
 * Fetch sub account transactions
 *
 * GET: /books/{bookId}/subaccttransactions
 * 
 * query:
 *   account {string} The account name to get the transactions for.
 *   accountCode {string} The account code to get the transactions for.
 *   userId {string} The id of user who owns the subaccount.
 *   companyId {string} The id of company who owns the subaccount.
 *   inQuoteCurrency {boolean} If true (default), converts all values to the quote currency first.
 *   
 */
const Book = require('../../models/book');
const { AleError, codes } = require('../errors');

const checkAccountInQuery = require('../helpers/validateAccountInQuery');
const checkSubAccountQuery = require('../helpers/validateSubAccountQuery');

exports.middleware = [checkAccountInQuery, checkSubAccountQuery];

exports.handler = function getSubAcctTransactions(req, res, next) {
    let id = parseInt(req.params.bookId);
    Book.findById(id).then(book => {
        if (!book) {
            throw new AleError(`Book with id ${id} does not exist`, codes.BookDoesNotExist);
        }
        if (req.query.userId && req.query.companyId) {
            throw new AleError(`Specify only one of userId or companyId for query`, codes.ValidationError);
        }

        if (req.query.userId) {
            const { account, perPage, page, userId } = req.query;
            const inQuote = req.query.inQuoteCurrency !== false;
            return book.allTransactions({ account, perPage, page, userId }, inQuote);
        } else if (req.query.companyId) {
            const { account, perPage, page, companyId } = req.query;
            const inQuote = req.query.inQuoteCurrency !== false;
            return book.allTransactions({ account, perPage, page, companyId }, inQuote);
        } else {
            throw new AleError(`userId or companyId for subaccount must be specified`, codes.MissingInput);
        }

    }).then(transactions => {
        res.json({
            success: true,
            message: `Sub-account transactions for ${req.query.account} with ${req.query.userId ? 'UserId' : ''} ${req.query.companyId ? 'CompanyId' : ''} ${req.query.userId ? req.query.userId : req.query.companyId}`,
            data: transactions
        })
    }).catch(err => {
        return next(err);
    });
};
