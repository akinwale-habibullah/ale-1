/**
 * Updates a single promo item
 *
 * PATCH: /promo/{itemId}
 * 
 */

const Promo = require('../../models/promo');

exports.handler = async function editSinglePromoItem(req, res, next) {

  const id = parseInt(req.params.itemId);
  const { isAdmin } = req;
  const { name, quantity, price, description, status } = req.body;

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
    const promoItem = await Promo.update(
      {
        name, quantity, price, description, status
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    )

    if (promoItem) {
      return res.json({
        success: true,
        message: 'Promo item updated',
        data: promoItem
      })
    } else {
      return res.json({
        success: false,
        message: 'Unable to upddate record now',
      })
    }

  } catch (error) {
    // Catch and return errors
    next(error);
  }
}
