const express = require("express");
const userRoute = express.Router();
const path = require("path");
const passport = require('passport');
require('../helpers/oAuth');




userRoute.use(passport.initialize());
userRoute.use(passport.session());



const addressContoller = require("../controllers/addressController");
const userController = require("../controllers/userController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/userAuthentication");


userRoute.get('/',isLoggedOut,userController.loadLandingPage)
//home page rendering
userRoute.get('/home',isLoggedIn,userController.loadHome);
// load signup page
userRoute.get('/signup',isLoggedOut,userController.loadSignup);
// load login page
userRoute.get('/login',isLoggedOut,userController.loadLogin);
// inserting user
userRoute.post('/signup',userController.insertUser);
// loading otp page
userRoute.get('/otp',isLoggedOut,userController.loadOtp);
// verifying otp
userRoute.post('/otp',isLoggedOut,userController.verifyOtp);

userRoute.post('/resend-otp',userController.resendOTP)

userRoute.get('/auth/google',passport.authenticate('google',{scope:['email','profile']}))

userRoute.get('/auth/google/callback',passport.authenticate('google',{
    successRedirect:'/success',
    failureRedirect:'/failure'
}))

userRoute.get('/success',userController.loadSuccessGoogle)

userRoute.get('/failure',userController.loadFailureGoogle);

//verify login
userRoute.post('/login',isLoggedOut,userController.verifyLogin);
userRoute.get('/logout',isLoggedIn,userController.logout)

//product details
userRoute.get('/product/detail',isLoggedIn,userController.loadProductDetails)
userRoute.get('/account',isLoggedIn,userController.loadAccount);

//add address
userRoute.post('/add-address',isLoggedIn,addressContoller.addAddress);

//edit user profile
userRoute.put('/update-account',isLoggedIn,userController.editAccount)

//edit address
userRoute.get('/account/edit-address',isLoggedIn,userController.loadEditAddress)
userRoute.put('/account/edit-address',isLoggedIn,userController.updateAddress);

module.exports = userRoute;
 