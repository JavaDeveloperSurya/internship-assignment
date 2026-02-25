const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../utils/user-schema-validation');
const {generateTokenForAdmin} = require('../utils/generate-tokens');
const Users = require('../models/Users');

// register an admin
const registerAdmin = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const {error} = loginValidation(req.body);
        if(error){
            res.status(400).json({
                success:false,
                message:error.details[0].message
            });
        }
        // check if admin already exists
        let admin = await Admin.findOne({email});
        if(admin){
            return res.status(400).json({
                success:false,
                message:'Admin already exists'
            });
        }
        // if admin does not exist, create a new admin
        admin = new Admin({email,password});
        await admin.save();
        res.status(201).json({
            success:true,
            message:'Admin registered successfully'
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// login admin
const loginAdmin = async(req,res)=>{
    const {email,password} = req.body;
    try {
        // schema validation
        const {error} = loginValidation(req.body);
        if(error){
            res.status(400).json({
                success:false,
                message:error.details[0].message
            });
        }
        // check if admin exists
        let admin = await Admin.findOne({email});
        if(!admin){
            res.status(404).json({
                success:false,
                message:'Invalid Credentials'
            });
        }
        // compare password
        const isPasswordMatch = await admin.isPasswordValid(password);
        if(!isPasswordMatch){
            res.status(404).json({
                success:false,
                message:'Invalid Credentials'
            });
        }
        // generate access token
        const accessToken = await generateTokenForAdmin(email);
        res.status(200).cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000, // 1 hour
        }).json({
            success:true,
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// change password
const changePassword = async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    try {
        const adminId = req.admin.adminId;
        // check if admin exists
        let admin = await Admin.findOne({_id:adminId});
        if(!admin){
            return res.status(404).json({
                success:false,
                message:'Admin not found'
            });
        }
        // compare old password
        const isPasswordMatch = await admin.isPasswordValid(oldPassword);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'password does not match'
            });
        }
        // update password
        admin.password = newPassword;
        await admin.save();
        res.status(200).json({
            success:true,
            message:'Password changed successfully'
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// refresh token
const refreshToken = async(req,res)=>{
    const {accessToken} = req.cookies;
    try {
        // check if access token is present in cookie
        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:'Access token missing, please login again'
            });
         }
        //  verify access token
        const decoded = await jwt.verify(accessToken,process.env.JWT_SECRET_KEY);
        const admin = await Admin.findOne({_id:decoded.adminId});
        if(!admin){
            return res.status(404).json({
                success:false,
                message:'Admin not found'
            });
        }
        // generate new access token
        const newAccessToken = await generateTokenForAdmin(admin.email);
        res.status(200).cookie('accessToken', newAccessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        }).json({
            success:true,
            message:'Access token refreshed successfully',
            accessToken:newAccessToken
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}
// logout admin
const logoutAdmin = async(req,res)=>{
    const {accessToken} = req.cookies;
    try {
        // check if access token is present in cookie
        if(!accessToken){
            return res.status(401).json({
                success:false,
                message:'Access token missing, please login again'
            });
         }
        res.clearCookie('accessToken');
        res.status(200).json({
            success:true,
            message:'Admin logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

// get all authors details
const getAuthors = async(req,res)=>{
    try{
        const users = await Users.find();
        const usersLength = await Users.countDocuments();
        res.status(200).json({
            success:true,
            count:usersLength,
            authors:users
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });
    }
}

// get all books of a author
const getBooksOfAuthor = async(req,res)=>{
    try{
        const id = req.params.id;
        const user = await Users.findById(id).populate('books');;
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }
        res.status(200).json({
            success:true,
            count:user.books.length,
            books:user.books
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    changePassword,
    refreshToken,
    logoutAdmin,
    getAuthors,
    getBooksOfAuthor
}