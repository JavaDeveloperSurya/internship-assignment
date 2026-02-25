const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const Users = require('../models/Users');
const Admin = require('../models/Admin');

// generate access token and refresh token for user
const generateTokensForUser = async(email)=>{
    try {
        let user = await Users.findOne({email});
        if(!user){
            throw new Error('user not found');
        }
        // generate access token
        const accessToken = jwt.sign({
            userId:user._id,
            fullName:user.fullName,
            email:user.email,
            gender:user.gender,
            role:'user'
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'15m'
        });
        // generate refresh token
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate()+7);

        await RefreshToken.create({
            token:refreshToken,
            user:user._id,
            expiresAt
        });
        return {accessToken,refreshToken};
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });   
    }
}

// generate access token and refresh token for admin
const generateTokenForAdmin = async(email)=>{
    try {
        let admin = await Admin.findOne({email});
        if(!admin){
            throw new Error('Admin not found');
        }
        // generate access token
        const accessToken = jwt.sign({
            adminId:admin._id,
            email:admin.email,
            role:'admin'
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'59m'
        });
        return accessToken;

    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal server error'
        }); 
    }
}

module.exports = {
    generateTokensForUser,
    generateTokenForAdmin
}