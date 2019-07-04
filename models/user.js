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
  joinDate: { type: Sequelize.STRING },
  memberId: { type: Sequelize.STRING, notNull: true },
  nextSavingsDate: { type: Sequelize.STRING },
  nextSavingsAmount: { type: Sequelize.STRING },
  position: { type: Sequelize.STRING },
  phone: { type: Sequelize.STRING },
  status: { type: Sequelize.STRING },
  isGuarantor: { type: Sequelize.BOOLEAN },
  
});

/**
 * Gets an existing user, or creates a new one
 * @param firstName The first name of the candidate user
 * @param lastName The last name of the candidate user
 * @param email The email of the candidate user
 * @param userName The username of the candidate user
 * @param password The password of the candidate user
 * @param joinDate The date the candidate user joined the cooperative
 * @param memberId The candidate user's member ID
 * @param nextSavingsDate The next due date of the candidate user
 * @param nextSavingsAmount The next savings amount of the candidate user
 * @param position The postion of the candidate user
 * @param phone The phone number of the candidate user
 * @param status The status of the candidate user
 * 
 */
User.getOrCreateUser = function (firstName, lastName, email, userName, password, joinDate, memberId, nextSavingsDate, nextSavingsAmount, position, phone, status, isGuarantor) {
  return User.findOrCreate({ where: { email }, defaults: { firstName, lastName, userName, password, joinDate, memberId, nextSavingsDate, nextSavingsAmount, position, phone, status, isGuarantor } })
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
