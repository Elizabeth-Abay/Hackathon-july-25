const Validator = require('../utils/schemaValidator');


class ValidatorMW {
    bodyValidator(schema) {
        // in the phase where the server starts the middleware 
        // will be returned and stored from this function 
        return (req, res, next) => {
            try {
                const { data } = Validator.validatorCreator(schema, req.body);
                // console.log("data from validation")
                // console.log(data)

                // Override req.body with the sanitized/validated Joi value
                req.validatedBody = data;
                next();
            } catch (error) {
                error.from = 'Validator.bodyValidator'
                next(error);
            }
        };
    }


    queryParamValidator(schema) {
        return (req, res, next) => {
            try {
                const { data } = Validator.validatorCreator(schema, req.query);
                // console.log("data from validation")
                // console.log(data)

                // Override req.body with the sanitized/validated Joi value
                req.validatedQueryParams = data;
                next();
            } catch (error) {
                error.from = 'Validator.queryParamValidator'
                next(error);
            }
        }
    }
}



module.exports = ValidatorMW;