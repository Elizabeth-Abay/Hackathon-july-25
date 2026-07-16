const Validator = require('../utils/schemaValidator');

function validate(schema) {
    // in the phase where the server starts the middleware 
    // will be returned and stored from this function 
    return (req, res, next) => {
        try {
            const { data } = Validator.validatorCreator(schema, req.body);
            
            // Override req.body with the sanitized/validated Joi value
            req.body = data; 
            next();
        } catch (error) {
            error.from = 'validate middleware from connection'
            next(error);
        }
    };
}


module.exports = validate;