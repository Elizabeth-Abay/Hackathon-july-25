const Joi = require('joi');


class AuthSchemas {
    static signUp = Joi.object({
        name: Joi.string().required(),
        email: Joi.email().required(),
        password: Joi.string().required().min(6),
        role: Joi.string().required().valid('agent', 'user'),
    })

    static verifyUserOtp = Joi.object({
        id: Joi.string().uuid().required(),
        OTP: Joi.string().length(6).required()
    });

    static logInValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6)
    });

    static resendOtpValidator = Joi.object({
        id : Joi.string().uuid().required()
    })


}





module.exports = AuthSchemas;
