const express = require('express');
const AuthSchemas = require('../schemas/authSchema');
const ValidatorMW = require('../middleware/schemaValidator');
const AuthController = require('../controller/authController');
const TokenDecoder = require('../middleware/tokenDecoder');


const authRouter = express.Router();
const authController = new AuthController();
const validatorObj = ValidatorMW()


// to create a user - by receiving the email only -- works
authRouter.post('/sign-up', validatorObj.bodyValidator(AuthSchemas.signUp), authController.signUp);

// to verify the user -- works
authRouter.post('/verify-otp', validatorObj.bodyValidator(AuthSchemas.verifyUserOtp), authController.verifyUserOtp);


authRouter.post('/resend-otp', validatorObj.bodyValidator(AuthSchemas.resendOtpValidator), authController.resendOtp)


// sign in -- works
authRouter.post('/log-in', validatorObj.bodyValidator(AuthSchemas.logInValidator), authController.logIn);

// sign out 
authRouter.post('/log-out', TokenDecoder.refreshDecoder, authController.logOut);

module.exports = authRouter;