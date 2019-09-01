const Sequelize = require('sequelize');
const sequelize = require('./connection');
const { AleError, codes } = require('../lib/errors');

/**
 * Promo items are items available for purchase at a discount
 */
const Promo = sequelize.define('promo', {
  name: { type: Sequelize.STRING },
  quantity: { type: Sequelize.INTEGER },
  price: { type: Sequelize.FLOAT },
  description: { type: Sequelize.STRING },
  status: { type: Sequelize.STRING },
});

module.exports = Promo;
