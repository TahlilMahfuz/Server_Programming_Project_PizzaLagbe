const express = require('express');
const router = express.Router();
const { checkIndexAuthenticated, checkNotAuthenticated, checkAuthenticated } = require('../middlewares/auth');

const {
    getChangePassword,
    getDeliverymanLogin,
    getEndDelivery,
    postChangePassword,
    postDelivered,
    postDeliverymanLogin,
} = require('../controllers/deliveryman.controllers');


router.get('/deliveryman/changepassword', getChangePassword);
router.get('/deliveryman/deliverymanlogin', getDeliverymanLogin);
router.get('/deliveryman/enddelivery', getEndDelivery);
router.post('/deliveryman/changepassword', postChangePassword);
router.post('/deliveryman/delivered', postDelivered);
router.post('/deliveryman/deliverymanlogin', postDeliverymanLogin);

module.exports = router;
