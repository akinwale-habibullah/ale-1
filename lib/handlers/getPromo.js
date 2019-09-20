/**
 * Get all existing promo items
 *
 * GET: /promo
 * 
 */

const Promo = require('../../models/promo');

exports.handler = async function getPromo(req, res, next) {
  try {
    // Get all promo items
    const allPromoItems = await Promo.findAll();
    return res.json({
      success: true,
      message: 'All user promo items returned',
      data: allPromoItems
    })
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}