const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @file This is the primary helper file for
 * authentication
 */

//  To generate hash password

function generateHashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

// To compare hash password and user input password

function compareHashAndTextPassword(hashPassword, password) {
  return bcrypt.compareSync(password, hashPassword);
}

//  To generate new token

function generateToken(id, isAdmin, position) {
  const token = jwt.sign({ userId: id, isAdmin, userPosition: position }, process.env.SECRET, { expiresIn: '7d' });
  return token;
}

module.exports = {
  generateHashPassword,
  compareHashAndTextPassword,
  generateToken,
};
