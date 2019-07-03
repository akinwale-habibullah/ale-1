/**
 * postUserSignin
 *
 * POST: /users/signin
 * 
 * body:
 *   email {string} Email of user to be signed in.
 *   password {string} Password of user to be signed in.
 *   
 */
const User = require('../../models/user');
const { generateHashPassword, generateToken, } = require('../helpers/auth');

exports.handler = function postUserSignin(req, res, next) {
    const { email, password } = req.body;

    User.getUserByAuth(email, password).then(result => {
        const cleanedResult = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            userName: result.userName,
            email: result.email
        }
        return cleanedResult;

    }).then(result => {
        const token = generateToken(result.id);
        return res.json({
            success: true,
            message: 'User signed in successfully',
            data: {user: result, token }
        });
    }).catch(err => {
        return next(err);
    });
};
