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
  guarantor1: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  guarantor2: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  guarantor3: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  approver1: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  approver2: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  approver3: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  rejecter1: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  rejecter2: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  rejecter3: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  status: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
});

Loan.belongsTo(User, { as: 'debtor' });


/**
 * Return count of existing guarantees
 *
 * @param {integer} id - User id of guarantor to run check on
 * 
 */

Loan.checkExistingGuarantees = async function (id) {
  const numberOfGuarantees = await Loan.count({
    where: {
      [Op.or]: [{ guarantor1: id }, { guarantor2: id }, { guarantor3: id }]
    }
  })
  return numberOfGuarantees
};

module.exports = Loan;
