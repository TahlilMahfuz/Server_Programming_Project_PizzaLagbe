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
    res.redirect("/user/userlogin");
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/user/dashboard");
    }
    next();
}


module.exports = {
    checkIndexAuthenticated,
    checkAuthenticated,
    checkNotAuthenticated
}