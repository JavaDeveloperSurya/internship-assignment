const express = require('express');
const {createBook,getAllBooks,getBookByCode,updateBookPrice,deleteBook} = require('../controllers/book-controller');
const router = express.Router();
const {authenticate,CanModifyBook} = require('../middlewares/auth-middleware');


router.post('/add',authenticate,createBook); //user
router.get('/',getAllBooks); 
router.get('/:code',getBookByCode); 
router.put('/:code',authenticate,CanModifyBook,updateBookPrice); //user owner or admin
router.delete('/:code',authenticate,CanModifyBook,deleteBook); //user owner or admin

module.exports=router;