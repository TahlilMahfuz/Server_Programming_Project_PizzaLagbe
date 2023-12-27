// customerRoutes.js
const express = require('express');
const router = express.Router();
const { checkIndexAuthenticated, checkNotAuthenticated, checkAuthenticated } = require('../middlewares/auth');
const {
    getDashboard,
    getUserDashboard,
    getUserLogin,
    getUserSignup,
    logout,
    getOrderPizza,
    getCart,
    makeReview,
    showReviewForm,
    placeOrder,
    validateUserSignup,
    registerUser,
    loginUser
} = require('../controllers/customer.controllers');

router.get("/", checkIndexAuthenticated, getDashboard);

router.get("/user/dashboard",checkAuthenticated, getUserDashboard); //will redirect to login as not authemticated user

router.get("/user/userlogin", checkNotAuthenticated, getUserLogin);

router.get("/user/usersignup", getUserSignup);

router.get("/userlogout", logout);

router.get("/user/orderpizza",checkAuthenticated,  getOrderPizza);

router.get("/user/cart",checkAuthenticated,  getCart);

router.post("/user/makereview", makeReview);

router.post("/user/review", showReviewForm);

router.post("/user/orderpizza", placeOrder);

router.post("/user/usersignup", validateUserSignup);

router.post("/user/register", registerUser);

router.post("/user/userlogin", loginUser);

module.exports = router;
