const express = require('express');
const router = express.Router();
const { checkIndexAuthenticated, checkNotAuthenticated, checkAuthenticated } = require('../middlewares/auth');
const{
    getadminLogin,
    getadminSignup,
    getadminDashboard,
    getaddOrderType,
    getaddPizza,
    getaddTopping,
    getaddBranch,
    getReviews,
    getshowOrders,
    markDelivered,
    markReady,
    deleteOrder,
    addBranch,
    addOrderType,
    addDeliveryMan,
    addPizza,
    addTopping,
    adminSignup,
    adminRegister,
    adminLogin,
} = require('../controllers/admin.controllers');



router.get('/admin/adminlogin', getadminLogin);
router.get('/admin/adminsignup', getadminSignup);
router.get('/admin/admindashboard', getadminDashboard);
router.get('/admin/addordertype', getaddOrderType);
router.get('/admin/addpizza', getaddPizza);
router.get('/admin/addtopping', getaddTopping);
router.get('/admin/addbranch', getaddBranch);
router.get('/admin/getreviews', getReviews);
router.get('/admin/showorders', getshowOrders);

// POST routes
router.post('/admin/delivered', markDelivered);
router.post('/admin/ready', markReady);
router.post('/admin/delete', deleteOrder);
router.post('/admin/addbranch', addBranch);
router.post('/admin/addordertype', addOrderType);
router.post('/admin/adddeliveryman', addDeliveryMan);
router.post('/admin/addpizza', addPizza);
router.post('/admin/addtopping', addTopping);
router.post('/admin/adminsignup', adminSignup);
router.post('/admin/adminregister', adminRegister);
router.post('/admin/adminlogin', adminLogin);

module.exports = router;