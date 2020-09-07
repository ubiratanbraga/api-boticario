const joi = require('joi');

class Base {
    //Validate fields;
    _validateFields(body, schema, limit) {
        try {
            joi.assert(body, schema);
            return false;
        } catch (errs) {
            const errors = [];
            errs.details.forEach((error) => {
                errors.push({
                    name: 'InvalidBody',
                    code: 400,
                    msg: error.message
                });
            });
            throw errors;
        }
    }
}

module.exports = Base;