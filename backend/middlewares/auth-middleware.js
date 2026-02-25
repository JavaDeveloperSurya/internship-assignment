const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const Admin = require('../models/Admin');
const Books = require('../models/Books');

// authentication middleware for user and admin
const authenticate = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success:false,
                message:'Authorization header missing or Unauthorized'
            });
        }
        const accessToken = authHeader.split(" ")[1];

        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:'Access token missing, please login again'
            });
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(400).json({
                success:false,
                message:'Invalid token'
            });
        }
        if(decoded.role === 'admin'){
            const admin = await Admin.findOne({_id:decoded.adminId});
            if(!admin){
                return res.status(404).json({
                    success:false,
                    message:'Admin not found'
                });
            }
        } else if(decoded.role === 'user'){
            const user = await Users.findOne({_id:decoded.userId});
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:'User not found'
                });
            }
            req.user = decoded;
        }   
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired, please login again"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Token verification failed"
        });

    }
}

// can be used user owner and admin authentication
const CanModifyBook = async(req,res,next)=>{
    const bookcode = req.params.code;
    if(req.user.role === 'admin'){
        next();
    } else if(req.user.role === 'user'){
        const book = await Books.findOne({code:bookcode});
        if(!book){
            return res.status(404).json({
                success:false,
                message:'Book not found'
            });
        }
        if(book.author.toString() === req.user.userId.toString()){
            next();
        } else {
            return res.status(403).json({
                success:false,
                message:'You are not authorized to modify this book'
            });
        }
    }
}

module.exports={
    authenticate,
    CanModifyBook
};