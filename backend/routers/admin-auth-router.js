const express = require('express');
const {registerAdmin,loginAdmin,changePassword,refreshToken,logoutAdmin,getAuthors,getBooksOfAuthor} = require('../controllers/admin-controller');
const {authenticate} = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.post('/change-password',authenticate,changePassword);
router.post('/refresh',refreshToken);
router.post('/logout',logoutAdmin);

router.get('/authors',authenticate,getAuthors);
router.get('/author-books/:id',authenticate,getBooksOfAuthor);

module.exports=router;