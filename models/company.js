const Sequelize = require('sequelize');
const sequelize = require('./connection');
const { AleError, codes } = require('../lib/errors');

/**
 * An company is an entity with intereactios with the cooperative  
 */
const Company = sequelize.define('company', {
  name: { type: Sequelize.STRING, notNull: true },
});

/**
 * Gets an existing company, or creates a new one
 * @param name The name of candidate company
 */
Company.getOrCreateCompany = function (name) {
  return Company.findOrCreate({ where: { name } })
    .then(result => {
      if (!result || result.length != 2) {
        return sequelize.Promise.reject(new AleError('User query failed to return expected result', codes.DatabaseQueryError));
      }
      const company = result[0];
      const isNewCompany = result[1];
      return { isNew: isNewCompany, company };
    });
};

module.exports = Company;
