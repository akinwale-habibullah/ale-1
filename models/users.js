const Sequelize = require('sequelize');
const sequelize = require('./connection');
const { AleError, codes } = require('../lib/errors');
const { compareHashAndTextPassword } = require('../lib/helpers/auth');

/**
 * An user is an individual authorised to use the application.  
 */
const User = sequelize.define('user', {
  firstName: { type: Sequelize.STRING, notNull: true },
  lastName: { type: Sequelize.STRING, notNull: true },
  email: { type: Sequelize.STRING, notNull: true },
  userName: { type: Sequelize.STRING, notNull: true },
  password: { type: Sequelize.STRING, notNull: true },
});

/**
 * Gets an existing user, or creates a new one
 * @param name The name of the new book
 * @param quoteCurrency The Base currency for the book. If the book already exists, this parameter must match the existing base currency or be undefined.
 */
User.getOrCreateUser = function (firstName, lastName, email, userName, password) {
  return User.findOrCreate({ where: { email }, defaults: { firstName, lastName, userName, password } })
    .then(result => {
      if (!result || result.length != 2) {
        return sequelize.Promise.reject(new AleError('User query failed to return expected result', codes.DatabaseQueryError));
      }
      const user = result[0];
      const isNewUser = result[1];
      return { isNew: isNewUser, user };
    });
};

/**
 * Gets auth for an existing user
 * @param userName The name of the user
 * @param password The password of the user
 */
User.getUserByAuth = function (email, password) {
  return User.find({ where: { email } })
    .then(result => {
      if (!result) {
        return sequelize.Promise.reject(new AleError('User with email does not exist', codes.DatabaseQueryError));
      }
      const comparePassword = compareHashAndTextPassword(result.password, password)
      if (!comparePassword) {
        return sequelize.Promise.reject(new AleError('Password is incorrect', codes.DatabaseQueryError));
      }
      return result;
    });
};

module.exports = User;
