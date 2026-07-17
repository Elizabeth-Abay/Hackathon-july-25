const AuthModelPg = require('../model/AuthModel');
const generateOTP = require('../utils/otpGenerator');
const shaHasher = require('../utils/shaHasher');
const EmailSendingFunctions = require('./emailSending');
const doesOtpMatch = require('../utils/OtpMatched');
const { RefreshToken, AccessToken } = require('./tokenGeneration');
const BcryptHelper = require('../utils/bcryptHelper');
const { use } = require('../config/emailTransporter');


const authModelPg = new AuthModelPg();
const refreshService = new RefreshToken();
const accessService = new AccessToken();

class AuthService {
    async signUp({ name , email , role , password }) {
        try {
            // check if user exist send them email 
            let isUniqueResult = await authModelPg.checkUserExist(email);

            if (isUniqueResult.data.length !== 0) {
                // means if there is a user with same email
                return {
                    success: false,
                    reason: "User already exists"
                }
            }

            // else generate and hash otp and email it
            let OTP = generateOTP();
            let otpHashed = shaHasher(OTP);

            // hash the password
            let hashedPassword = await BcryptHelper.bcryptHasher(password)

            // sending email
            let res = await EmailSendingFunctions.sendingOTPEmail({ email, OTP });
            //console.log(`OTP is ${OTP} and the user email sent is ${res}`)

            // creating the user node and the user in pg
            let userInPg = await authModelPg.signUp({ name , email , role , hashedPassword , otpHashed });
            // //console.log("userinPg" , userInPg);


            let { id } = userInPg.data;


            return {
                success: true,
                data: id
            }

        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                // this is so that if lower layer's message won't be masked
                err.from = 'AuthService.createUser';
            }
            throw err;
        }

    }

    async verifyUser({ id, OTP }) {
        try {
            // get Otp and hash and compare it
            // hash otp

            console.log(id)
            console.log(OTP)
            let otpHashed = shaHasher(OTP);

            console.log("id , otp in service")
            console.log({ id, OTP })

            // update status of user to verified and check the otp matches
            let gotVerified = await authModelPg.setUserAsVerified({id , otpHashed });

            if (!gotVerified.success) {
                return {
                    success: false,
                    reason: "Couldnt update user status maybe otp mismatch"
                }
            }

            // else create tokens
            console.log("gotVerified Result")
            console.log(gotVerified)
            let { role } = gotVerified.data;

            let accessToken = accessService.generateAccess({id , role });
            let refreshToken = await refreshService.generateRefresh(id);
            // //console.log("ref " , refreshToken);

            if (!accessToken.success || !refreshToken.success) {
                accessToken.success ? refreshToken : accessToken;
                // means return either one to be the cause
            }

            accessToken = accessToken.data;
            refreshToken = refreshToken.dataForUser;

            // //console.log("refreshToken from ser" , refreshToken );



            return {
                success: true,
                data: {
                    accessToken,
                    refreshToken
                }

            }


        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                err.from = 'AuthService.verifyUser';
            }
            throw err;
        }
    }


    async resendOtp(id) {
        try {
            // else generate and hash otp and email it
            let OTP = generateOTP();
            let otpHashed = shaHasher(OTP);

            // updating the OTP in the table
            let updatingOtp = await authModelPg.resendOtp({ id, otpHashed });

            if (!updatingOtp.success) return updatingOtp;

            let { email } = updatingOtp.data

            // sending email
            await EmailSendingFunctions.sendingOTPEmail({ email, OTP });

            //console.log(`OTP generated is ${OTP}`)

            return { success: true }

        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                err.from = 'AuthService.resendOtp';
            }
            throw err;
        }


    }

    async logIn({ email, password }) {
        try {
            let result = await authModelPg.logIn(email);

            if (!result.success) return result;

            // then cr8 access and ref tokens
            // fetch some posts and some new connections

            let { id, password : hashedPassword , role } = result.data;
            

            let passwordsMatched = await BcryptHelper.bcryptCompare(password, hashedPassword);

            if (!passwordsMatched) return {
                success: false,
                reason: "Password mismatch"
            }


            let accessToken = accessService.generateAccess({id , role});
            let refreshToken = await refreshService.generateRefresh(id);
            // //console.log("ref " , refreshToken);

            if (!accessToken.success || !refreshToken.success) {
                accessToken.success ? refreshToken : accessToken;
                // means return either one to be the cause
            }

            accessToken = accessToken.data;
            refreshToken = refreshToken.dataForUser;

            // //console.log("refreshToken from ser" , refreshToken );



            return {
                success: true,
                data: {
                    accessToken,
                    refreshToken
                }

            }



        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                err.from = 'AuthService.logIn';
            }
            throw err;
        }
    }


    // not done yet
    async logOut(randomString) {
        try {
            // log-out means to invalidate that refresh tokens
            let hashedRandomString = shaHasher(randomString);

            let invalidateRefreshToken = await refreshService.invalidateForLogOut(hashedRandomString);

            return invalidateRefreshToken;

        } catch (err) {
            // the lower layers will throw error and the upper layer will be the one to catch that
            if (typeof err === 'object' && !err.from) {
                err.from = 'AuthService.logOut';
            }
            throw err;
        }

    }
}


module.exports = AuthService;