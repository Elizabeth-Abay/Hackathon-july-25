const express = require('express');
const AuthSchemas = require('../schemas/authSchema');
const validate = require('../middleware/joiValidator');
const AuthController = require('../controller/authController');
const TokenDecoder = require('../middleware/tokenDecoder');


const authRouter = express.Router();
const authController = new AuthController();


// to create a user - by receiving the email only -- works
authRouter.post('/sign-up', validate(AuthSchemas.signUp), authController.signUp);

// to verify the user -- works
authRouter.post('/verify-otp', validate(AuthSchemas.verifyUserOtp), authController.verifyUserOtp);


authRouter.post('/resend-otp', validate(AuthSchemas.resendOtpValidator), authController.resendOtp)


// sign in -- works
authRouter.post('/log-in', validate(AuthSchemas.logInValidator), authController.logIn);

// sign out 
authRouter.post('/log-out', TokenDecoder.refreshDecoder, authController.logOut);

module.exports = authRouter;