const Sequelize = require('sequelize');
const sequelize = require('./connection');
const { AleError, codes } = require('../lib/errors');
const User = require('./user');
const Loan = require('./loan');

/**
 * A repayment is money paid towards clearing a loan 
 */
const Repayment = sequelize.define('repayment', {
  date: { type: Sequelize.DATE, validate: { isDate: true }, defaultValue: Date.now },
  amount: { type: Sequelize.FLOAT },
  status: { type: Sequelize.STRING },
});

Repayment.belongsTo(Loan);
Repayment.belongsTo(User);

module.exports = Repayment;
