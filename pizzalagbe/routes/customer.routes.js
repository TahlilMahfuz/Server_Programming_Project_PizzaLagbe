const express = require('express');
const router = express.Router();
const { checkIndexAuthenticated, checkNotAuthenticated, checkAuthenticated } = require('../middlewares/auth');
const {
    googlelogin,
    googlecallback,
    googleredirect,
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
    loginUser,
    googlefailure,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    deleteComment
} = require('../controllers/customer.controllers');

router.get("/", checkIndexAuthenticated, getDashboard);
router.get("/auth/google",googlelogin);
router.get("/auth/google/callback",googlecallback);
router.get("/user/googleredirect",checkAuthenticated,googleredirect);
router.get("/user/googlefailure",googlefailure);
router.get("/user/dashboard",checkAuthenticated, getUserDashboard); 
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


router.put("/user/updatephonenumber/:userphone",checkAuthenticated, updatePhoneNumber);
router.put("/user/updatefirstname/:firstname",checkAuthenticated, updateFirstName);
router.put("/user/updatelastname/:lastname",checkAuthenticated, updateLastName);


router.delete("/user/deletecomment/:orderid",checkAuthenticated, deleteComment);

module.exports = router;
