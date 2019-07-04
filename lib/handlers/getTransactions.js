/**
 * List all transactions for given accounts
 *
 * GET: /books/{bookId}/transactions
 * 
 * query:
 *   account {string} Name of account to return transactions for.
 *   accountCode {number} Code of account to return transactions for.
 *   perPage {integer} The number of results per page.
 *   page {integer} The page number.
 *   
 */
const Book = require('../../models/book');
const { AleError, codes } = require('../errors');
const checkAccountInQuery = require('../helpers/validateAccountInQuery')

exports.middleware = checkAccountInQuery;
exports.handler = function getTransactions(req, res, next) {
    let id = parseInt(req.params.bookId);
    Book.findById(id).then(book => {
        if (!book) {
            throw new AleError(`Book with id ${id} does not exist`, codes.BookDoesNotExist);
        }
        const { account } = req.query.account;
        const { perPage, page } = req.query;
        return book.getTransactions({ account, perPage, page });
    }).then(txs => {
        const result = txs.map(t => t.values());
        res.json({
            success: true,
            message: `All transactions for ${req.query.account} returned `,
            data: result
        })
    }).catch(err => {
        return next(err);
    });
};
