// customerController.js
const {pool} = require("../config/dbconfig");
const bcrypt = require('bcrypt');
const passport = require('passport');
const sendMail = require("../middlewares/sendmail");
require("../config/oAuthConfig");

const loginUser = passport.authenticate("user", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/userlogin",
    failureFlash: true
});

const googlelogin = passport.authenticate("google", {
    scope: ["email", "profile"]
});

const googlecallback = passport.authenticate("google", {
    successRedirect: "/user/googleredirect",
    failureRedirect: "/auth/google/failure",
    failureFlash: true
});

const googleredirect = (req, res) => {  
    // console.log("hi i am here\n");
    // res.json(req.user);
    pool.query(
        `select * from customers where customeremail=$1`,[req.user.email],
        (err,results)=>{
            if(err){
                throw err;
            }
            else if(results.rows.length>0){
                req.session.user = results.rows[0];
                req.session.save();
                let no_err=[];
                no_err.push({message:"Logged in using google authorization 2.0"});
                res.render('user/dashboard',{no_err});
            }
            else{
                pool.query(
                    `insert into customers(firstname,lastname,customeremail) values($1,$2,$3) returning *`,
                    [req.user.given_name,req.user.family_name,req.user.email],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            req.session.user = results.rows[0];
                            req.session.save();
                            let no_err=[];
                            no_err.push({message:"Logged in using google authorization 2.0"});
                            res.render('user/dashboard',{no_err});
                        }
                    }
                );
            }
        }
    );
};

const googlefailure = (req, res) => {
    let error=[];   
    error.push({message:"Google authorization failed"});
    res.render('user/userlogin',{error});
};

const getDashboard = (req, res) => {
    if(req.session.admin){
        pool.query(
            `select * from branches`,
            (err,results)=>{
                if(err){
                    throw err;
                }
                const resultsArray = Array.from(results.rows);
                pool.query(
                    `select * from ordertype`,
                    (err,result)=>{
                        if(err){
                            throw err;
                        }
                        
                        const resultArray = Array.from(result.rows);
                        res.render('admin/admindashboard',{results: resultsArray,result: resultArray});
                    }
                );
            }
        );
    }
    else if(req.session.deliveryman){
        pool.query(
            `select * from orders natural join deliveryman,customers
            where orders.customerid=customers.customerid and deliverymanid=$1 and status=2`,
                [req.session.deliveryman.deliverymanid],
                (err, results) => {
                if (err) {
                    throw err;
                }
                else{
                    const resultsArray = Array.from(results.rows);
                    console.log(results);
                    res.render('deliveryman/deliverymandashboard',{results:resultsArray});
                }
    
            }
        );
    }
    else{
        res.render('index');
    }
};

const getUserDashboard = (req, res) => {
    req.session.user = req.user;
    req.session.save();
    res.render('user/dashboard');
};

const getUserLogin = (req, res) => {
    res.render('user/userlogin');
};

const getUserSignup = (req, res) => {
    pool.query(
        `select * from branches`,
        (err, results) => {
            if (err) {
                throw err;
            }
            const resultsArray = Array.from(results.rows);
            res.render('user/usersignup', { results: resultsArray });
        }
    );
};

const logout = (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.session.destroy();
        res.redirect("/user/userlogin");
    });
};

const getOrderPizza = (req, res) => {
    pool.query(
        `select * from pizzas`,
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                pool.query(
                    `select * from toppings`,
                    (err,result)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            pool.query(
                                `select * from ordertype`,
                                (err,resul)=>{
                                    if(err){
                                        throw err;
                                    }
                                    
                                    pool.query(
                                        `select * from branches`,
                                        (err,resu)=>{
                                            if(err){
                                                throw err;
                                            }
                                            
                                            const resultsArray = Array.from(results.rows);
                                            const resultArray = Array.from(result.rows);
                                            const resulArray = Array.from(resul.rows);
                                            const resuArray = Array.from(resu.rows);
                                            res.render('user/orderpizza',{resu:resuArray,resul:resulArray,result:resultArray,results:resultsArray});
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

const getCart = (req, res) => {
    let userid = req.session.user.customerid;
    pool.query(
        `SELECT *,
        CASE
        WHEN status = 1 THEN 'Preparing'
        WHEN status = 2 THEN 'Deliveryman in progress'
        WHEN status = 3 THEN 'Delivered'
        WHEN status = 4 THEN 'Delivered'
        WHEN status = 5 THEN 'Deleted'
        END AS status_text
        FROM orders
        NATURAL JOIN orderpizzatopping
        NATURAL JOIN customers
        NATURAL JOIN ordertype
        NATURAL JOIN branches
        natural join deliveryman
        natural join pizzas,toppings
        WHERE customerid = $1 AND status <=5
        and orderpizzatopping.toppingid=toppings.toppingid`, [userid],
        (err, results) => {
            if (err) {
                throw err;
            }

            const resultsArray = Array.from(results.rows);
            res.render('user/cart', { results: resultsArray });
        }
    );
};

const makeReview = (req, res) => {
    let {orderid,rating,comment}=req.body;
    console.log('The rating, comment and orderid is'+rating+" "+comment+" "+orderid);
    pool.query(
        `call review_order($1,$2,$3)`, [rating,comment,orderid],
        (err, results) => {
            if (err) {
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"Your review has been submitted"});
                let userid = req.session.user.customerid;
                pool.query(
                    `SELECT *,
                    CASE
                    WHEN status = 1 THEN 'Preparing'
                    WHEN status = 2 THEN 'Deliveryman in progress'
                    WHEN status = 3 THEN 'Delivered'
                    WHEN status = 4 THEN 'Delivered'
                    WHEN status = 5 THEN 'Deleted'
                    END AS status_text
                    FROM orders
                    NATURAL JOIN orderpizzatopping
                    NATURAL JOIN customers
                    NATURAL JOIN ordertype
                    NATURAL JOIN branches
                    natural join deliveryman
                    natural join pizzas,toppings
                    WHERE customerid = $1 AND status <=5
                    and orderpizzatopping.toppingid=toppings.toppingid`, [userid],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }

                        const resultsArray = Array.from(results.rows);
                        res.render('user/cart', { results: resultsArray,no_err });
                    }
                );
            }
        }
    );
};

const showReviewForm = (req, res) => {
    let { orderid } = req.body;
    res.render('user/review', { orderid });
};

const placeOrder = (req, res) => {
    let userid = req.session.user.customerid;
    let { pizzas, toppings, ordertype, branch, address, quantity } = req.body;
    console.log(pizzas, toppings, branch, ordertype, address,userid, quantity);


    pool.query(
        'CALL place_order($1, $2, $3, $4, $5, $6, $7)',
        [pizzas, toppings, branch, ordertype, address, userid,quantity],
        (err, results) => {
            if (err) {
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"Order has been placed and added to cart."});
                res.render('user/dashboard',{no_err});
            }

        }
    );
};

const validateUserSignup = async (req, res) => {
    let {firstname,lastname,useremail,userphone,userpassword,cuserpassword,branch} = req.body;

    console.log(firstname,lastname,useremail,userphone,userpassword,cuserpassword,branch);
    
    let error=[];

    if(userpassword!=cuserpassword){
        error.push({message: "Passwords do not match"});
        res.render('user/usersignup',{error});
    }
    else{
        const userotp = Math.floor(1000 + Math.random() * 9000);

        pool.query(
            `select * from customers where customeremail=$1`,[useremail],
            (err,results)=>{
                if(err){
                    throw err;  
                }
                console.log("database connected");
                console.log(results.rows);

                if(results.rows.length>0){
                    error.push({message: "Email already exists"});
                    res.render("user/usersignup",{error});
                }
                else{
                    let message="Your otp varification code is ";
                    let subject="Verify your account";
                    sendMail(useremail,userotp,subject,message);
                    res.render('user/register',{firstname,lastname,useremail,userphone,userpassword,userotp,branch});
                }
            }
        );
    }
};

const registerUser = async(req, res) => {
    let {firstname,lastname,useremail,userphone,userpassword,userotp,uservarcode} = req.body;
    let error=[];
    if(userotp!=uservarcode){
        error.push({message:"Invalid varification code"});
        res.render("user/register",{error});
    }
    else{
        let hash=await bcrypt.hash(userpassword,10);
        console.log(hash);
        pool.query(
            `INSERT INTO customers (firstname,lastname,customeremail,customerphone,customerpassword)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING firstname,lastname,customeremail,customerphone,customerpassword`,
            [firstname,lastname,useremail,userphone,hash],
            (err, results) => {
            if (err) {
                throw err;
            }
                console.log(results.rows);
                console.log("Data inserted");
                req.flash("success_msg", "You are now registered. Please log in");

                let no_err=[];
                no_err.push({message:"Account created. You can log in now"});
                res.render("user/userlogin",{no_err});
            }
        );
        
    }
};

const updatePhoneNumber = async(req, res) => {
    let {userphone} = req.body;
    let userid = req.session.user.customerid;
    pool.query(
        `update customers set customerphone=$1 where customerid=$2 returning *`,
        [userphone,userid],
        (err, results) => {
            if (err) {
                throw err;
            }
            else{
                req.session.user = results.rows[0];
                req.session.save();
                let no_err=[];
                no_err.push({message:"Phone number updated"});
                res.status(200).json({no_err});
            }
        }
    );
}

const updateFirstName = async(req, res) => {
    let {firstname} = req.body;
    let userid = req.session.user.customerid;
    pool.query(
        `update customers set firstname=$1 where customerid=$2 returning *`,
        [firstname,userid],
        (err, results) => {
            if (err) {
                throw err;
            }
            else{
                req.session.user = results.rows[0];
                req.session.save();
                let no_err=[];
                no_err.push({message:"First name updated"});
                res.status(200).json({no_err});
            }
        }
    );
}

const updateLastName = async(req, res) => {
    let {lastname} = req.body;
    let userid = req.session.user.customerid;
    pool.query(
        `update customers set lastname=$1 where customerid=$2 returning *`,
        [lastname,userid],
        (err, results) => {
            if (err) {
                throw err;
            }
            else{
                req.session.user = results.rows[0];
                req.session.save();
                let no_err=[];
                no_err.push({message:"Last name updated"});
                res.status(200).json({no_err});
            }
        }
    );
}

const deleteComment = async(req, res) => {
    let {orderid} = req.body;
    //check if order exists
    pool.query(
        `select * from orders where orderid=$1`,[orderid],
        (err,results)=>{
            if(err){
                throw err;
            }
            else if(results.rows.length==0){
                let error=[];
                error.push({message:"Order does not exist"});
                res.status(400).json({error});
            }
            else{
                pool.query(
                    `update orders set comment='' where orderid=$1`,
                    [orderid],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        else{
                            let no_err=[];
                            no_err.push({message:"Order deleted"});
                            res.status(200).json({no_err}); 
                        }
                    }
                );
            }
        }
    );
}

module.exports = {
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
    googlelogin,
    googlecallback,
    googleredirect,
    googlefailure,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    deleteComment
};