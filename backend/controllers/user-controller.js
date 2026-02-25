const RefreshToken = require('../models/RefreshToken');
const Users = require('../models/Users');
const {registerValidation,loginValidation} = require('../utils/user-schema-validation');
const {generateTokensForUser} = require('../utils/generate-tokens');

// register an user
const registerUser = async(req,res)=>{
    const {fullName,email,password,gender,address} = req.body;
    
    try {
        // schema validation
        const {error} = registerValidation(req.body);
        if(error){
            return res.status(400).json({
                success:false,
                message:error.details[0].message
            })
        }
        // check user existance
        let user = await Users.findOne({email});
        
        if(user){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            });
        }
        // if user does not exist create a new user
        user = new Users({fullName,email,password,gender,address});
        await user.save();
        res.status(201).json({
            success:true,
            message:'user registered successfully'
        })
    } catch (error) {
       res.status(500).json({
        success:false,
        message:'Internal Server error'
       });
    }
}
  
// login user
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const {error} = loginValidation(req.body);
        if(error){
            return res.status(400).json({
                success:false,
                message:error.details[0].message
            });
        }
        // check if user exists
        let user = await Users.findOne({email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found, please register first'
            });
        }
        
        // compare password
        const isPasswordValid = await user.isPasswordValid(password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:'Invalid Credentials'
            })
        }
        // await RefreshToken.deleteOne({user:user._id});
        const {accessToken,refreshToken} = await generateTokensForUser(email);
        // refresh token stores in cookie
        res.status(200)
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days in milliseconds
            })
            .json({
                success:true,
                message:'user login successful',
                accessToken,
                refreshToken //testing purpose only
            });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        })
    }
}

// change password
const changePassword = async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    try {
        const userId = req.user.userId;
        // check if user exists
        let user = await Users.findOne({_id:userId});
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }
        // compare old password
        const isPasswordValid = await user.isPasswordValid(oldPassword);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:'password is incorrect'
            });
        }
        // update password
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:'Password changed successfully'
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Authentication failed'
        })
    }
}

// refresh token
const refreshToken = async(req,res)=>{
    const {refreshToken} = req.cookies;
    try {
        // check if refresh token is present in cookie
        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:'Refresh token missing, please login again'
            });
        }
        // check if refresh token is valid
        const storedToken = await RefreshToken.findOne({token:refreshToken});
        if(!storedToken){
            return res.status(401).json({
                success:false,
                message:'Invalid refresh token, please login again'
            });
        }
        // check if refresh token is expired
        if(storedToken.expiresAt < new Date()){
            await RefreshToken.deleteOne({token:refreshToken});
            return res.status(401).json({
                success:false,
                message:'Refresh token expired, please login again'
            });
        }
        
        // generate new access token
        await RefreshToken.deleteOne({_id:storedToken._id}); // delete token before create 
        let user = await Users.findOne({_id:storedToken.user});
        const {accessToken:newAccessToken,refreshToken:newRefreshToken} = await generateTokensForUser(user.email);
        
        res.status(200)
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days in milliseconds
            })
            .json({
                success:true,
                message:'Access token refreshed successfully',
                newAccessToken,
                refreshToken:newRefreshToken //testing purpose only
            });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        })
    }
}

// logout user
const logoutUser = async(req,res)=>{
    const {refreshToken} = req.cookies;
    try {
        // check if refresh token is present in cookie
        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:'Refresh token missing, please login again'
            });
        }
        
        const storedToken = await RefreshToken.findOne({token:refreshToken});
        if(!storedToken){
            return res.status(401).json({
                success:false,
                message:'Invalid refresh token, please login again'
            });
        }
        const user = await Users.findOne({_id:storedToken.user});
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }
        await RefreshToken.deleteOne({token:refreshToken});
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
        res.status(200).json({
            success:true,
            message:'User logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
    logoutUser
};