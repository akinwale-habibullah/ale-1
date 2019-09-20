/**
 * Create a new promo item
 *
 * POST: /addpromo
 * 
 */

const Loan = require('../../models/loan');
const Promo = require('../../models/promo');
exports.handler = async function postPromoLoans(req, res, next) {
  const { isAdmin } = req;
  const { items } = req.body;

  try {

    let createdItemsArray = [];

    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this route',
      })
    }

    for (const element of items) {
      const newItem = await Promo.create({ name: element.name, quantity: Number(element.quantity), price: Number(element.price), description: element.description, status: 'active' });
      createdItemsArray.push(newItem)
    }

    return res.json({
      success: true,
      message: 'New promo items created',
      data: createdItemsArray,
    })

  } catch (error) {
    console.log('error', error);
    
    next(error);
  }
}



