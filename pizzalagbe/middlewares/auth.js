//API
const checkIndexAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/user/dashboard");
    }
    next();
}

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    let error = [];
    error.push({ message: "You are unauthorized" });
    res.render("user/userlogin", { error });
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/user/dashboard");
    }
    next();
}

const checkAdminAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    let error = [];
    error.push({ message: "You are unauthorized" });
    res.render("admin/adminlogin", { error });
}

const checkAdminNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/admin/admindashboard");
    }
    next();
}


module.exports = {
    checkIndexAuthenticated,
    checkAuthenticated,
    checkNotAuthenticated,
    checkAdminAuthenticated,
    checkAdminNotAuthenticated
}