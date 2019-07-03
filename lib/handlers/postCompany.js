/**
 * postCompany
 *
 * POST: /company
 * 
 * body:
 *   name {string} Name of company to be registered.
 *   
 */
const Company = require('../../models/company');

exports.handler = function postCompany(req, res, next) {
    const { name } = req.body;

    Company.getOrCreateCompany(name).then(result => {
        return result;
    }).then(cleanedResult => {
        if (cleanedResult.isNew === false) {
            return res.json({
                success: false,
                message: 'Company already exists already',
                data: cleanedResult
            });
        }
        return res.json({
            success: true,
            message: 'New company has been created successfully',
            data: cleanedResult
        });
    }).catch(err => {
        return next(err);
    });
};
