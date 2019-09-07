/**
 * Get exco details
 *
 * GET: /exco
 * 
 */

const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user');

exports.handler = async function getExco(req, res, next) {
  const { USEFULCONTACTPOSITION1, USEFULCONTACTPOSITION2, USEFULCONTACTPOSITION3 } = process.env;
  try {
    // Get useful contact details
    const contact1 = await User.findOne({ where: { position: USEFULCONTACTPOSITION1 }, attributes: ['id', 'firstName', 'lastName', 'position', 'phone', 'email'] })
    const contact2 = await User.findOne({ where: { position: USEFULCONTACTPOSITION2 }, attributes: ['id', 'firstName', 'lastName', 'position', 'phone', 'email'] })
    const contact3 = await User.findOne({ where: { position: USEFULCONTACTPOSITION3 }, attributes: ['id', 'firstName', 'lastName', 'position', 'phone', 'email'] })
    return res.json({
      success: true,
      message: 'Useful contacts returned',
      data: [contact1, contact2, contact3]
    })
  } catch (error) {
    // Catch and return errors
    next(error);
  }
}