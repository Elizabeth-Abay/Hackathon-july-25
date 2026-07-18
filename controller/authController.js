const AuthService = require('../service/authService');

const authService = new AuthService();



// remaining tasks - log out - on service , here and schema validator lay input
// refresh token part work on
// next demo start the searching logics
class AuthController {
    constructor() { }

    async signUp(req, res, next) {
        // to be able to call the global error handler in case of error
        try {
            console.log("Request received");
            // validator already called in the routes
            let { name, email, role, password } = req.validatedBody;

            let result = await authService.signUp({ name, email, role, password });

            return result.success ?
                res.status(201).json({ id: result.data })
                :
                res.status(400).json(result)


        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = "AuthControllers.signUp";
            }

            next(err); // this will call the error handler
        }
    }


    async verifyUserOtp(req, res, next) {
        try {
            let { id, OTP } = req.validatedBody;

            //console.log("Verifying otp" , { id, OTP })



            let result = await authService.verifyUser({ id, OTP })

            if (!result.success) console.log(result)

            return result.success ?
                res.status(200).json(result.data)
                :
                res.status(400).json(result);

            // result.data - contain { accessToken,refreshToken }

        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = 'AuthControllers.verifyUser';
            }
            next(err);
        }
    }


    async resendOtp(req, res, next) {
        try {
            // params - for path parameter
            // query - for query parameter access
            // but resend shld be post request
            let { id } = req.validatedBody;
            let result = await authService.resendOtp(id);

            return (result.success) ?
                res.status(200).json(result)
                :
                res.status(400).json(result)

        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = 'AuthControllers.resendOtp';
            }
            next(err);
        }

    }




    async logIn(req, res, next) {
        try {
            //console.log("Log in called");
            // email and password
            let { email, password } = req.validatedBody;

            let result = await authService.logIn({ email, password });

            //console.log("result of login " , result);

            return result.success ?
                res.status(200).json(result) :
                res.status(400).json(result);


        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = 'AuthControllers.logIn';
            }
            next(err);
        }
    }


    async logOut(req, res, next) {
        try {
            // when ppl log out they send in refresh token
            let { randomString } = req.decodedRefresh;
            console.log("random String")
            console.log(randomString)

            let result = await authService.logOut(randomString);

            return result.success
                ?
                res.status(200).json(result)
                :
                res.status(400).json(result);


        } catch (err) {
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = 'AuthControllers.logOut';
            }
            next(err);
        }
    }

}


module.exports = AuthController;