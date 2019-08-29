/**
 * Create a new user
 *
 * POST: /users/signup
 * 
 * body:
 *   firstName {string} Firstname of user to be registered.
 *   lastName {string} Lastname of user to be registered.
 *   email {string} Email of user to be registered.
 *   userName {string} Username of user to be registered.
 *   password {string} Password of user to be registered.
 *   joinDate {string} Join date of user to be registered.
 *   memberId {string} MemberID of user to be registered.
 *   nextSavingsDate {string} Next savings date of user to be registered.
 *   nextSavingsAmount {string} Next savings amount of user to be registered.
 *   position {string} Executive position of user to be registered.
 *   phone {string} Phone number of user to be registered.
 *   status {string} Status of user to be registered.
 *   
 */
const User = require('../../models/user');
const { generateHashPassword, generateToken } = require('../helpers/auth');

exports.handler = function postUserSignup(req, res, next) {
    const { firstName, lastName, email, userName, password, isAdmin, joinDate, memberId, nextSavingsDate, nextSavingsAmount, position, phone, status, isGuarantor } = req.body;
    const hashPassword = generateHashPassword(password.trim());

    User.getOrCreateUser(firstName, lastName, email, userName, hashPassword, isAdmin, joinDate, memberId, nextSavingsDate, nextSavingsAmount, position, phone, status, isGuarantor).then(result => {
        const cleanedResult = {
            isNew: result.isNew,
            user: {
                id: result.user.id,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                userName: result.user.userName,
                email: result.user.email,
                memberId: result.user.memberId,
                isAdmin: result.user.isAdmin,
                position: result.user.position
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
        cleanedResult.token = generateToken(cleanedResult.user.id, cleanedResult.user.isAdmin, cleanedResult.user.position);
        return res.json({
            success: true,
            message: 'New account has been created successfully',
            data: cleanedResult
        });
    }).catch(err => {
        return next(err);
    });
};
