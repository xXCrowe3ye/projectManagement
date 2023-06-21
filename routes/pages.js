const express = require("express");
const loggedin = require("../controllers/loggedin")
const logout = require("../controllers/logout")
const userDetailsController = require("../controllers/userDetails");
const login = require("../controllers/login");
const router = express.Router();
const accessControl = require('../controllers/accessControl');



router.get("/", loggedin, (req, res) => {
    if(req.user){
        res.render("index", {status: "loggedin", user: req.user});
    } else {
        res.render("index", {status: "no", user: {}});
    }
});


router.get("/profile", loggedin,(req, res) => {
    res.render("profile", {user: req.user});
})

router.get("/register", (req, res) => {
    res.sendFile("register.html", {root:"./public"});
})

router.get("/login", loggedin, (req, res) => {
    res.sendFile("login.html", {root:"./public/"});
})

router.get("/index", (req, res) => {
    res.sendFile("index.ejs", {root:"./views/"});
})

router.get("/logout", logout)

router.get('/user-details', loggedin, userDetailsController.getAllUserDetails);

//crud



// Only admin can delete user details
router.get('/user-details', loggedin, accessControl.canView, userDetailsController.getAllUserDetails);
router.get('/user-details/:userId', loggedin, accessControl.canView, userDetailsController.getUserDetails); // This is the new route to view a single user's details
router.get('/user-details/edit/:userId', loggedin, accessControl.canEdit, userDetailsController.getEditUserDetails);
router.post('/user-details/update/:userId', loggedin, accessControl.canEdit, userDetailsController.updateUserDetails);
router.get('/user-details/delete/:userId', loggedin, accessControl.canDelete, userDetailsController.deleteUserDetails);

//visualization
router.get('/visualize', loggedin, userDetailsController.getVisualizePage);

// Login
router.post('/api/login', login); // add your login route

module.exports = router;
