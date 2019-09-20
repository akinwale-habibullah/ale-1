/**
 * Create a new promo loan request
 *
 * POST: /promoloans
 * 
 * body:
 *   items {array} Promo items to get loan for.
 *   
 */

const Loan = require('../../models/loan');
const PromoRequest = require('../../models/promoRequest');
exports.handler = async function postPromoLoans(req, res, next) {
  const { userId } = req;
  const { items } = req.body;
  const loanAmount = await items.reduce(function (accumulator, currentValue) {
    return accumulator + Number(currentValue.amount);
  }, 0);
  const repayment = await loanAmount / 3;

  try {

    let requestedItemsArray = [];

    for (const element of items) {
      const newItem = await PromoRequest.create({ item: element.item, quantity: Number(element.quantity), price: Number(element.price), amount: Number(element.amount), comments: element.comments, requesterId: userId })
      requestedItemsArray.push(newItem)
    }

    const newLoan = await Loan.create({ debtorId: userId, repayment, loanAmount, tenure: 3, type: 'promo', status: 'pending' })
    return res.json({
      success: true,
      message: 'New promo loan request created',
      data: { newLoan, requestedItemsArray }
    })

  } catch (error) {
    next(error);
  }
}



