const {pool} = require("../config/dbconfig");
const bcrypt = require('bcrypt');
const passport = require('passport');
const sendMail = require("../middlewares/sendmail");
// Controller functions
const getChangePassword = (req, res) => {
    res.render('deliveryman/changepassword');
};

const getDeliverymanLogin = (req, res) => {
    res.render('deliveryman/deliverymanlogin');
};

const getEndDelivery = (req, res) => {
    pool.query(
        `select * from orders natural join ordertype natural join customers natural join branches where status=2 and typeid=1 and branchid=$1`,
        [req.session.deliveryman.branchid],
        (err, results) => {
            if (err) {
                throw err;
            } else {
                const resultsArray = Array.from(results.rows);
                res.render('deliveryman/enddelivery', { results: resultsArray });
            }
        }
    );
};

const postChangePassword = (req, res) => {
    let { password } = req.body;
    pool.query(
        `update deliveryman set password=$1 where deliverymanid=$2`,
        [password, req.session.deliveryman.deliverymanid],
        (err, results) => {
            if (err) {
                throw err;
            } else {
                pool.query(
                    `select * from orders natural join deliveryman,customers
                    where orders.customerid=customers.customerid and deliverymanid=$1 and status=2`,
                    [req.session.deliveryman.deliverymanid],
                    (err, results) => {
                        if (err) {
                            throw err;
                        } else {
                            let no_err = [];
                            no_err.push({ message: 'Password has been updated.' });
                            const resultsArray = Array.from(results.rows);
                            res.render('deliveryman/deliverymandashboard', { results: resultsArray, no_err });
                        }
                    }
                );
            }
        }
    );
};

const postDelivered = (req, res) => {
    let { orderid } = req.body;
    let deliverymanid=req.session.deliveryman.deliverymanid;
    console.log('The deliveryman id is : '+deliverymanid);
    console.log('The order id is : '+orderid);
    console.log('The branch id is : '+req.session.deliveryman.branchid);
    pool.query(
        `update orders set status=status+1 where orderid=$1`, [orderid],
        (err, results) => {
            if (err) {
                throw err;
            } 
            pool.query(
                `select * from orders natural join deliveryman,customers
                where orders.customerid=customers.customerid and deliverymanid=$1 and status=2`,
                    [req.session.deliveryman.deliverymanid],
                    (err, results) => {
                    if (err) {
                        throw err;
                    }
                    else{
                        let no_err=[];
                        no_err.push({message:'Payment taken and order has been delivered.'});
                        const resultsArray = Array.from(results.rows);
                        console.log(results);
                        res.render('deliveryman/deliverymandashboard',{results:resultsArray,no_err});
                    }
        
                }
            );
        }
    );
};

// const postDeliverymanLogin = (req, res) => {
//     let { deliverymanid, deliverymanpassword } = req.body;
//     pool.query(
//         `select * from deliveryman where deliverymanid = $1`, [deliverymanid],
//         (err, results) => {
//             if (err) {
//                 throw err;
//             } 
//             else if (results.rows.length > 0) {
//                 console.log('The password is'+deliverymanpassword);
//                 console.log('The database password is'+results.rows[0].password);
//                 if (deliverymanpassword === results.rows[0].password) {
//                     const deliveryman=results.rows[0];
//                     req.session.deliveryman=deliveryman;
//                     pool.query(
//                         `select * from orders natural join deliveryman,customers,branches,ordertype
//                         where orders.customerid=customers.customerid and deliverymanid=$1 and status=2
//                         and ordertype.typeid=orders.typeid and branches.branchid=orders.branchid`,
//                             [req.session.deliveryman.deliverymanid],
//                             (err, results) => {
//                             if (err) {
//                                 throw err;
//                             }
//                             else{
//                                 const resultsArray = Array.from(results.rows);
//                                 console.log(results);
//                                 res.render('deliveryman/deliverymandashboard',{results:resultsArray});
//                             }
                
//                         }
//                     );
//                 } 
//                 else {
//                     let error = [];
//                     error.push({ message: "Incorrect Password" });
//                     res.render('deliveryman/deliverymanlogin', { error });
//                 }
//             } 
//             else {
//                 let error = [];
//                 error.push({ message: "No deliveryman exists with this email." });
//                 res.render('deliveryman/deliverymanlogin', { error });
//             }
//         }
//     );
// };

const postDeliverymanLogin = passport.authenticate('deliveryman', {
    successRedirect: '/deliveryman/dashboard',
    failureRedirect: '/deliveryman/login',
    failureFlash: true
});

const getdeliverymandashboard= async (req,res)=>{
    try{
        const results= await pool.query(
            `select * from orders natural join deliveryman,customers,branches,ordertype
            where orders.customerid=customers.customerid and deliverymanid=$1 and status=2
            and ordertype.typeid=orders.typeid and branches.branchid=orders.branchid`,
                [req.user.deliverymanid]
        );
        const resultsArray = Array.from(results.rows);
        console.log(results);
        res.render('deliveryman/deliverymandashboard',{results:resultsArray});
    }
    catch(err){
        console.log(err);
        res.render('deliveryman/deliverymanlogin',{error:err});
    }
}

// Export the controller functions
module.exports = {
    getChangePassword,
    getDeliverymanLogin,
    getEndDelivery,
    postChangePassword,
    postDelivered,
    postDeliverymanLogin,
    getdeliverymandashboard
};
