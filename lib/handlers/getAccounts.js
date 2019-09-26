/**
 * List all accounts
 *
 * GET: /books/{bookId}/accounts
 * 
 */

const Book = require('../../models/book');
const { AleError, codes } = require('../errors');
exports.handler = async function getAccounts(req, res, next) {
    let id = parseInt(req.params.bookId);
    const inQuote = req.query.inQuoteCurrency !== false;
    const resultAccounts = [];
    try {
        const book = await Book.findById(id);
        if (!book) {
            throw new AleError(`Book with id ${id} does not exist`, codes.BookDoesNotExist);
        }
        const accounts = await book.listAllAccounts();
        
        for await (let account of accounts) {
            const { accountName } = account;
            account.dataValues.balance = await book.getBalance({ account: accountName }, inQuote);        
            resultAccounts.push(account);
        }

        return res.json({
            success: true,
            message: `All accounts returned from book ${id}`,
            data: resultAccounts
        })

    } catch (error) {
        return next(error);
    }
}
