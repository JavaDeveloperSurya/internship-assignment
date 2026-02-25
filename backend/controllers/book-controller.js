const Books = require('../models/Books');
const bookValidation = require('../utils/book-schema-validaion');
const Users = require('../models/Users');

// create book
const createBook = async(req,res)=>{
    try {
        const {title,description,price} = req.body;
        const publishedDate = req.body.publishedDate ? new Date(req.body.publishedDate) : new Date();
        const bookLength = await Books.countDocuments();
        const bookData = {title,description,publishedDate,author:req.user.userId,code:`BOOK-${bookLength+1}`,price};
        // schema validation
        const {error} = bookValidation(bookData);
        if(error){
            return res.status(400).json({
                success:false,
                message:error.details[0].message
            }); 
        }
        // book stores in book collection
        const book = new Books(bookData);
        const savedBook = await book.save();
        // book id push to books array of users collection
        const user = await Users.findOne({_id:req.user.userId});
        user.books.push(savedBook._id);

        await user.save();
        res.status(201).json({
            success:true,
            message:'Book created successfully',
            data:book
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// get all books
const getAllBooks = async(req,res)=>{
    try {
        const books = await Books.find();
        res.status(200).json({
            success:true,
            count:books.length,
            data:books
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// get book by id
const getBookByCode = async(req,res)=>{
    try {
        const bookCode=req.params.code;

        const book = await Books.findOne({code:bookCode});
        if(!book){
            return res.status(404).json({
                success:false,
                message:'Book not found'
            });
        }
        res.status(200).json({
            success:true,
            count:1,
            data:book
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// update book
const updateBookPrice = async(req,res)=>{
    try {
        const bookCode = req.params.code;
        const {price} = req.body;
        if(!price){
            res.status(400).json({
                success:false,
                message:'provide the value for book price'
            });
        }
        const updatedData=await Books.findOneAndUpdate(
            {code:bookCode},
            {$set:{price:price}},
            {returnDocument: 'after'}
        );
        if(updatedData){
            res.status(200).json({
                success:true,
                message:"Book updated",
                data:updatedData
            })
        } else {
            res.status(404).json({
                success:false,
                message:'Book not found'
            })
        }
        if(!bookCode){
            res.status(400).json({
                success:false,
                message:'invalid book code'
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// delete book
const deleteBook = async(req,res)=>{
    try {
        const bookCode = req.params.code;
        if(!bookCode){
            res.status(400).json({
                success:false,
                message:'invalid book code'
            })
        }
        const deletedBook=await Books.findOneAndDelete({code});
        const author = deletedBook.author;
        await Users.findByIdAndUpdate(
            author,   
            { $pull: { books: deletedBook._id } }
        );
        if(deletedBook){
            res.status(200).json({
                success:true,
                message:"Book delete successful",
                data:deletedBook
            })
        } else {
            res.status(404).json({
                success:false,
                message:'Book not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookByCode,
    updateBookPrice,
    deleteBook
};