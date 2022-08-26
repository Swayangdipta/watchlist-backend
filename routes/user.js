const router = require('express').Router()

const {getUserById,getUserInfo,login,logout,register,updateUser,removeUser,pushContentInUser,popContentFromUser,isAuthenticated,isSignedIn} = require("../controllers/user")

router.param("userId",getUserById);

router.get("/user/:userId",getUserInfo);
router.get("/logout",logout);

router.post("/login",login);
router.post("/register",register);

router.put("/user/edit/:userId",isSignedIn,isAuthenticated,updateUser);
router.put("/user/new/content/:userId",isSignedIn,isAuthenticated,pushContentInUser);
router.put("/user/remove/content/:userId",isSignedIn,isAuthenticated,popContentFromUser);

router.delete("/user/close/:userId",isSignedIn,isAuthenticated,removeUser);
// router.delete("/admin/user/close/:userId/:adminId",isSignedIn,isAdmin,removeUser);

module.exports = router;