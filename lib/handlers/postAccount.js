/**
 * Create a new account
 *
 * POST: /books/{bookId}/accounts
 * 
 * body:
 *   accountCode {integer} Unique code for the new account.
 *   accountName {string} Name for new account.
 *   toIncrease {string} Posting to increase account.
 *   isPorL {boolean} Is this a 'P or L' or 'Balance sheet' account.
 *   accountType {string}
 *   subAccountType {string}
 *   memo {string} Some description of the account.
 *   
 */
const { codes, AleError } = require('../errors');
const Book = require('../../models/book');
const Account = require('../../models/account');

exports.middleware = checkBook;

function checkBook(req, res, next) {
    let id = parseInt(req.params.bookId);
    Book.findByPk(id).then(res => {
        if (!res) {
            throw new AleError(`Book specified in params does not exist`, codes.BookDoesNotExist);
        }
        return next();
    }).catch(err => {
        return next(err);
    });
};

exports.handler = function postAccount(req, res, next) {
    let id = parseInt(req.params.bookId);
    let acctCode = parseInt(req.body.accountCode);
    const { accountName, toIncrease, isPorL, accountType, subAccountType, memo } = req.body;

    Account.getOrCreateBook(acctCode, accountName, toIncrease, isPorL, accountType, subAccountType, memo, id).then(result => {

        return result;
    }).then(e => {
        return res.json({
            success: true,
            message: 'New account has been created successfully',
            account: e[0]
        });
    }).catch(err => {
        return next(err);
    });
};
