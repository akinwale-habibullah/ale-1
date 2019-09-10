const Sequelize = require('sequelize');
const sequelize = require('./connection');
const Op = require('Sequelize').Op;
const { AleError, codes } = require('../lib/errors');
const User = require('./user');

/**
 * A loan in a cash or item advance to member expected to be repaid
 */
const Loan = sequelize.define('loan', {
  loanAmount: { type: Sequelize.FLOAT, notNull: true, },
  interest: { type: Sequelize.FLOAT },
  fees: { type: Sequelize.FLOAT },
  tenure: { type: Sequelize.INTEGER },
  comments: { type: Sequelize.STRING },
  repayment: { type: Sequelize.INTEGER },
  // guarantor1Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // guarantor2Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // guarantor3Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // approver1Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // approver2Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // approver3Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // rejecter1Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // rejecter2Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  // rejecter3Id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     // This is a reference to another model
  //     model: User,

  //     // This is the column name of the referenced model
  //     key: 'id',
  //   }
  // },
  status: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
});

Loan.belongsTo(User, { as: 'debtor' });
Loan.belongsTo(User, { as: 'guarantor1' });
Loan.belongsTo(User, { as: 'guarantor2' });
Loan.belongsTo(User, { as: 'guarantor3' });
Loan.belongsTo(User, { as: 'approver1' });
Loan.belongsTo(User, { as: 'approver2' });
Loan.belongsTo(User, { as: 'approver3' });
Loan.belongsTo(User, { as: 'rejecter1' });
Loan.belongsTo(User, { as: 'rejecter2' });
Loan.belongsTo(User, { as: 'rejecter3' });


/**
 * Return count of existing guarantees
 *
 * @param {integer} id - User id of guarantor to run check on
 * 
 */

Loan.checkExistingGuarantees = async function (id) {
  const numberOfGuarantees = await Loan.count({
    where: {
      [Op.or]: [{ guarantor1Id: id }, { guarantor2Id: id }, { guarantor3Id: id }]
    }
  })
  return numberOfGuarantees
};

module.exports = Loan;
