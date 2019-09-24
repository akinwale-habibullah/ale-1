/**
 * Get a single promo item
 *
 * GET: /promo/{itemId}
 * 
 */

const Promo = require('../../models/promo');

exports.handler = async function getSinglePromoItem(req, res, next) {

  const id = parseInt(req.params.itemId);
  const { isAdmin } = req;

  try {
    if (!isAdmin) {
      return res.json({
        success: false,
        message: 'Only admins can access this route',
      })
    }
    if (!id) {
      return res.json({
        success: false,
        message: 'Send promo item ID to search for in params',
      })
    }
    // Get promo item details and return values
    const promoItem = await Promo.findById(id)

    if (promoItem) {
      return res.json({
        success: true,
        message: 'Promo item returned',
        data: promoItem
      })
    } else {
      return res.json({
        success: false,
        message: 'Promo item not found',
      })
    }

  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
