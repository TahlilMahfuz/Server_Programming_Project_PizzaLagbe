const express = require('express');
const router = express.Router();
const {checkAdminAuthenticated, checkAdminNotAuthenticated} = require('../middlewares/auth');
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
    deleteBranch,
    putbranch,
    updatebranch,
    updatePizzaPrice,
    updatePizzaDetails,
    updatePizzaName,
    updatetoppingName,
    updateToppingDetails,
    updateToppingPrice,
    deletePizza,
    deleteTopping,
    deleteOrderType
} = require('../controllers/admin.controllers');



router.get('/admin/adminlogin',checkAdminNotAuthenticated, getadminLogin);
router.get('/admin/adminsignup', getadminSignup);
router.get('/admin/admindashboard',checkAdminAuthenticated, getadminDashboard);
router.get('/admin/addordertype', getaddOrderType);
router.get('/admin/addpizza', getaddPizza);
router.get('/admin/addtopping', getaddTopping);
router.get('/admin/addbranch', getaddBranch);
router.get('/admin/getreviews', getReviews);
router.get('/admin/showorders', getshowOrders);


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

router.put('/admin/putbranch/:branchname', putbranch);
router.put('/admin/updatebranch/:branchid/:branchname', updatebranch);
router.put('/admin/updatepizzaprice/:pizzaid/:price', updatePizzaPrice);
router.put('/admin/updatepizzadetails/:pizzaid/:details', updatePizzaDetails);
router.put('/admin/updatepizzaname/:pizzaid/:pizzaname', updatePizzaName);
router.put('/admin/updatetoppingname/:toppingid/:toppingname', updatetoppingName);
router.put('/admin/updatetoppingdetails/:toppingid/:details', updateToppingDetails);
router.put('/admin/updatetoppingprice/:toppingid/:price', updateToppingPrice);


router.delete('/admin/deletebranch/:branchid', deleteBranch);
router.delete('/admin/deletepizza/:pizzaid', deletePizza);
router.delete('/admin/deletetopping/:toppingid', deleteTopping);
router.delete('/admin/deleteordertype/:typeid', deleteOrderType);


module.exports = router;