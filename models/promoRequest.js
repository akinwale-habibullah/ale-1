const Sequelize = require('sequelize');
const sequelize = require('./connection');
const { AleError, codes } = require('../lib/errors');
const User = require('./user');

/**
 * Promo items are items available for purchase at a discount
 */
const PromoRequest = sequelize.define('promoRequest', {
  item: { type: Sequelize.STRING },
  quantity: { type: Sequelize.INTEGER },
  price: { type: Sequelize.FLOAT },
  amount: { type: Sequelize.FLOAT },
  comments: { type: Sequelize.STRING },
});

PromoRequest.belongsTo(User, { as: 'requester' });

module.exports = PromoRequest;
