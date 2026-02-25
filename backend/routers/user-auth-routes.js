const express = require('express');
const {registerUser,loginUser,changePassword,refreshToken,logoutUser} = require('../controllers/user-controller');
const {authenticate} = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/change-password',authenticate,changePassword);
router.post('/refresh',refreshToken);
router.post('/logout',logoutUser);

module.exports=router;