/**
 * postUserSignup
 *
 * POST: /users/signup
 * 
 * body:
 *   firstName {string} Firstname of user to be registered.
 *   lastName {string} Lastname of user to be registered.
 *   email {string} Email of user to be registered.
 *   userName {string} Username of user to be registered.
 *   password {string} Password of user to be registered.
 *   
 */
const User = require('../../models/users');
const { generateHashPassword, generateToken } = require('../helpers/auth');

exports.handler = function postUserSignup(req, res, next) {
    const { firstName, lastName, email, userName, password } = req.body;
    const hashPassword = generateHashPassword(password.trim());

    User.getOrCreateUser(firstName, lastName, email, userName, hashPassword).then(result => {
        const cleanedResult = {
            isNew: result.isNew,
            user: {
                id: result.user.id,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                userName: result.user.userName,
                email: result.user.email
            }
        }
        return cleanedResult;
    }).then(cleanedResult => {
        if (cleanedResult.isNew === false) {
            return res.json({
                success: false,
                message: 'User with email exists already',
                data: cleanedResult
            });
        }
        cleanedResult.token = generateToken(res.id);
        return res.json({
            success: true,
            message: 'New account has been created successfully',
            data: cleanedResult
        });
    }).catch(err => {
        return next(err);
    });
};
