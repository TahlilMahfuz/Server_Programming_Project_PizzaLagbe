const {pool} = require("../dbconfig");
const bcrypt = require('bcrypt');
const passport = require('passport');
const sendMail = require("../middlewares/sendmail");


const getadminLogin = (req, res) => {
    res.render('admin/adminlogin');
};

const getaddOrderType = (req, res) => {
    res.render('admin/addordertype');
};

const getadminSignup = (req, res) => {
    pool.query(
        `SELECT * FROM branches`,
        (err, results) => {
        if (err) {
            throw err;
        }

        const resultsArray = Array.from(results.rows);
        res.render('admin/adminsignup', { results: resultsArray });
        }
    );
};

const getadminDashboard = (req, res) => {
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
};
const getaddPizza = (req, res) => {
   res.render('admin/addpizza');
};

const getaddTopping = (req, res) => {
    res.render('admin/addtopping');
};

const getaddBranch = (req, res) => {
    res.render('admin/addbranch');
};

const getReviews = async (req, res) => {
    console.log(req.session.admin);
    await pool.query(
        `select *
        from orders natural join orderpizzatopping
            natural join customers
            natural join ordertype
            natural join branches
            natural join deliveryman
            natural join admins,pizzas,toppings
        where rating is not null and branchid=$1
        and orderpizzatopping.pizzaid=pizzas.pizzaid and orderpizzatopping.toppingid=toppings.toppingid`,[req.session.admin.branchid],
        (err,results)=>{
            if(err){
                throw err;
            }
            const resultsArray = Array.from(results.rows);
            res.render('admin/showreviews',{results: resultsArray});
        }
    );
};

const getshowOrders =(req, res) => {
    console.log(req.session.admin);
    pool.query(
        `select *
        from orders natural join orderpizzatopping
            natural join customers
            natural join ordertype
            natural join branches
            natural join admins,pizzas,toppings
        where status=1 and branchid=$1
        and orderpizzatopping.pizzaid=pizzas.pizzaid and orderpizzatopping.toppingid=toppings.toppingid`, [req.session.admin.branchid],
        (err, results) => {
            if (err) {
                throw err;
            }
            const resultsArray = Array.from(results.rows);
            res.render('admin/showorders', { results: resultsArray });
        }
    );
};  




const markDelivered = (req, res) => {
    let {orderid}=req.body;
    console.log("The orderid name is : "+orderid);
    pool.query(
        `update orders set status=status+1 where orderid=$1`,[orderid],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"Payment has been taken and order has been delivered"});
                pool.query(
                    `select *
                    from orders natural join orderpizzatopping natural join customers natural join ordertype natural join branches natural join admins
                    where status=0 and branchid=$1`,[req.session.admin.branchid],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        const resultsArray = Array.from(results.rows);
                        res.render('admin/showorders',{results: resultsArray,no_err});
                    }
                );
            }
        }
    );
  };
  
  const markReady = (req, res) => {
    let {orderid}=req.body;
    console.log("The orderid name is : "+orderid);
    pool.query(
        `update orders set status=status+1 where orderid=$1`,[orderid],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:'Order is ready and added to delivery list'});
                pool.query(
                    `select *
                    from orders natural join orderpizzatopping natural join customers natural join ordertype natural join branches natural join admins
                    where status=1 and branchid=$1`,[req.session.admin.branchid],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        const resultsArray = Array.from(results.rows);
                        res.render('admin/showorders',{results: resultsArray,no_err});
                    }
                );
            }
        }
    );
  };
  
  const deleteOrder = (req, res) => {
    let { orderid } = req.body;
    console.log("The orderid name is : "+orderid);
    pool.query(
        `update orders set status=5 where orderid=$1`,[orderid],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                pool.query(
                    `select *
                    from orders natural join orderpizzatopping natural join customers natural join ordertype natural join branches natural join admins
                    where status=1 and branchid=$1`,[req.session.admin.branchid],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        const resultsArray = Array.from(results.rows);
                        res.render('admin/showorders',{results: resultsArray});
                    }
                );
            }
        }
    );
  };
  
  const addBranch = (req, res) => {
    let {branch}=req.body;
    console.log("The branch name is : "+branch);
    pool.query(
        `select * from branches where branchname=$1`,[branch],
        (err,results)=>{
            if(err){
                throw err;
            }
            else if(results.rows.length>0){
                let error=[];
                error.push({message:"This branch already exists."});
                res.render('admin/addbranch',{error});
            }
            else{
                pool.query(
                    `insert into branches (branchname) values($1)`,[branch],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            let no_err=[];
                            no_err.push({message:"Branch Inserted successfully."});   
                            res.render('admin/addbranch',{no_err});
                        }
                    }
                );
            }
        }
    );
  };
  
  const addOrderType = (req, res) => {
    let {ordertype}=req.body;
    pool.query(
        `select * from ordertype where type=$1`,[ordertype],
        (err,results)=>{
            if(err){
                throw err;
            }
            else if(results.rows.length>0){
                let error=[];
                error.push({message:"This type already exists."});
                res.render('admin/addordertype',{error});
            }
            else{
                pool.query(
                    `insert into ordertype (type) values($1)`,[ordertype],
                    (err,results)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            let no_err=[];
                            no_err.push({message:"Ordetype Inserted successfully."});   
                            res.render('admin/addordertype',{no_err});
                        }
                    }
                );
            }
        }
    );
  };
  
  const addDeliveryMan = async (req, res) => {
    let {name,dtype,hidden_dtype,branch,hidden_branch,phone} = req.body;

    console.log(name,dtype,branch,phone);

    pool.query(
        `Insert into deliveryman (typeid,name,branchid,phone)
        values ($1,$2,$3,$4) returning deliverymanid,typeid,name,branchid,phone`,[dtype,name,branch,phone],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"Delivery man has been inserted"});
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
                                res.render('admin/admindashboard',{results: resultsArray,result: resultArray,no_err});
                            }
                        );
                    }
                );
            }
        }
    );
  };
  
  const addPizza = async (req, res) => {
    let {pizzaname,details,price} = req.body;

    console.log(pizzaname,details,price);
    
    pool.query(
        `Insert into pizzas (pizzaname, details, price)
        values ($1,$2,$3) returning pizzaname,details,price`,[pizzaname,details,price],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"Pizza has been inserted"});
                res.render('admin/addpizza',{no_err});
            }
        }
    );
  };
  
  const addTopping = async (req, res) => {
    let {toppingname,details,price} = req.body;

    console.log(toppingname,details,price);
    
    pool.query(
        `Insert into toppings (toppingname, details, price)
        values ($1,$2,$3) returning toppingname,details,price`,[toppingname,details,price],
        (err,results)=>{
            if(err){
                throw err;
            }
            else{
                let no_err=[];
                no_err.push({message:"topping has been inserted"});
                res.render('admin/addtopping',{no_err});
            }
        }
    );
  };
  
const adminSignup = async (req, res) => {
    let {masterkey,adminname,branchid,adminemail,adminphone,adminpassword,cadminpassword} = req.body;

    console.log(masterkey,adminname,branchid,adminemail,adminphone,adminpassword,cadminpassword);
    
    let error=[];

    if(adminpassword!=cadminpassword){
        error.push({message: "Passwords do not match"});
        pool.query(
            `select * from branches`,
            (err,results)=>{
                if(err){
                    throw err;
                }
                
                const resultsArray = Array.from(results.rows);
                res.render('admin/adminsignup',{results: resultsArray,error});
            }
        );
    }
    else if(masterkey!="1234"){
        error.push({message: "Incorrect masterkey.Please contact authority"});
        pool.query(
            `select * from branches`,
            (err,results)=>{
                if(err){
                    throw err;
                }
                
                const resultsArray = Array.from(results.rows);
                res.render('admin/adminsignup',{results: resultsArray,error});
            }
        );
    }
    else{
        const adminotp = Math.floor(1000 + Math.random() * 9000);

        pool.query(
            `select * from admins where adminemail=$1`,[adminemail],
            (err,results)=>{
                if(err){
                    throw err;
                }
                console.log("database connected");
                console.log(results.rows);

                if(results.rows.length>0){
                    error.push({message: "Email already exists"});
                    pool.query(
                        `select * from branches`,
                        (err,results)=>{
                            if(err){
                                throw err;
                            }
                            
                            const resultsArray = Array.from(results.rows);
                            res.render('admin/adminsignup',{results: resultsArray,error});
                        }
                    );
                }
                else{
                    let message="Your otp varification code is ";
                    let subject="Verify your account";
                    sendMail(adminemail,adminotp,subject,message);
                    res.render('admin/adminregister',{adminname,branchid,adminemail,adminphone,adminpassword,adminotp});
                }
            }
        );
    }
};
  
const adminRegister = async (req, res) => {
    let {adminname,branchid,adminemail,adminphone,adminpassword,adminotp,adminvarcode} = req.body;
    let error=[];
    if(adminotp!=adminvarcode){
        error.push({message:"Invalid varification code"});
        res.render("admin/adminregister",{error});
    }
    else{
        let hash=await bcrypt.hash(adminpassword,10);
        console.log(hash);
        pool.query(
            `INSERT INTO admins (adminname,branchid,adminemail,adminphone,adminpassword)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING adminname,branchid,adminemail,adminphone,adminpassword`,
            [adminname,branchid,adminemail,adminphone,hash],
            (err, results) => {
            if (err) {
                throw err;
            }
                console.log(results.rows);
                console.log("Data inserted");
                req.flash("success_msg", "You are now registered admin. Please log in");

                let no_err=[];
                no_err.push({message:"Account created. You can log in now as an admin"});
                res.render("admin/adminlogin",{no_err});
            }
        );
    }
};
  
const adminLogin = async (req, res) => {
    let { adminemail, adminpassword } = req.body;
    console.log("admin email: " + adminemail);
    console.log("admin password: " + adminpassword);
  
    let error = [];
    pool.query(
      `select * from admins where adminemail=$1`,
      [adminemail],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
  
        if (results.rows.length > 0) {
          const admin = results.rows[0];
  
          bcrypt.compare(adminpassword, admin.adminpassword, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              pool.query(
                `select * from branches`,
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  const resultsArray = Array.from(results.rows);
                  pool.query(
                    `select * from ordertype`,
                    (err, result) => {
                      if (err) {
                        throw err;
                      }
  
                      const resultArray = Array.from(result.rows);
                      req.session.admin = admin; // Save admin data in session
                      res.render('admin/admindashboard', { results: resultsArray, result: resultArray });
                    }
                  );
                }
              );
            } else {
              // Password is incorrect
              error.push({ message: "Incorrect Password" });
              res.render("admin/adminlogin", { error });
            }
          });
        } else {
          // No user
          console.log("no user");
          error.push({ message: "No admins found with this email" });
          res.render("admin/adminlogin", { error });
        }
      }
    );
}
  
  // Export all controller functions
  module.exports = {
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
  };